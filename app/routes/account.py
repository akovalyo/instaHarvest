import json
from datetime import datetime
from dateutil import tz
from flask import Blueprint, request, url_for
from flask_jwt_extended import (fresh_jwt_required, get_jwt_identity,
                                jwt_required)
from app import db
from app.models import User
from app.utils.security import ts, admin_required
from app.utils.email_support import send_email
from app.config import Config
import boto3

bp = Blueprint('account', __name__, url_prefix='/api/account')


@bp.route('/get_profile_private', methods=['POST'])
@jwt_required
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return {}, 404
    res = user.to_dict_private()
    return res, 200


@bp.route('/<string:addr>')
def get_profile_public(addr):
    user = User.query.filter_by(profile_addr=addr).first()
    if not user:
        return {}, 404
    res = user.to_dict_public()
    return res, 200


@bp.route('/change_pass', methods=['PATCH'])
@fresh_jwt_required
def change_pass():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return {}, 404
    user.change_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return {'msg': 'Password updated'}, 200


@bp.route('/edit_profile', methods=['PATCH'])
@jwt_required
def edit_profile():
    """
    Can update only `first_name`, `last_name`, `image_url`, `address`,
    `address`, `city`, `state`, `zip_code`

    """
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return {}, 404
    for key, value in data.items():
        setattr(user, key, value)
    db.session.add(user)
    db.session.commit()
    return {'msg': 'Profile updated'}, 200


@bp.route('/edit_username', methods=['PATCH'])
@fresh_jwt_required
def edit_username():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return {}, 404
    username = data['username']
    if User.query.filter_by(username=username).first():
        return {'error': f'The user with username {username} already exists'}, 409
    user.username = username
    db.session.add(user)
    db.session.commit()
    return {'msg': 'Username updated'}, 200


@bp.route('/edit_profile_address', methods=['PATCH'])
@jwt_required
def edit_profile_address():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return {}, 404
    new_profile_addr = data['profile_addr']
    if User.query.filter_by(profile_addr=new_profile_addr).first():
        return {'error': f'This address already exists'}, 409
    user.profile_addr = new_profile_addr
    db.session.add(user)
    db.session.commit()
    return {'msg': 'Profile address updated'}, 200


@bp.route('/request_change_email', methods=['POST'])
@fresh_jwt_required
def edit_email():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return {}, 404
    now = datetime.now(tz=tz.tzlocal())
    time_diff = now - user.confirm_email_sent
    if time_diff.seconds < 14400:
        return {'error': f'Sorry, you can resend request in {(14400 - time_diff.seconds) // 60} minutes'}, 406
    new_email = data['new_email']
    if User.query.filter_by(email=new_email).first():
        return {'error': f'The user with email {new_email} already exists'}, 409
    email_token = ts.dumps([new_email, user.email], salt='email-change')
    confirm_url = url_for('.change_email', token=email_token, _external=True)
    subject = "InstaHarvest email change verification"
    send_email(new_email, subject, 'confirmation_email',
               user=user, confirm_url=confirm_url)

    subject = "InstaHarvest email change notification"
    send_email(user.email, subject, 'change_email_notification',
               user=user, new_email=new_email)
    user.confirm_email_sent = now
    db.session.add(user)
    db.session.commit()
    return {'msg': f'A confirmation e-mail was sent to your {new_email} address. Please follow the instructions in the e-mail to confirm your new email'}, 200


@bp.route('/confirm/<token>')
def change_email(token):
    try:
        new_email, old_email = ts.loads(
            token, salt="email-change", max_age=86400)
    except:
        return redirect(f"{Config.BASE_URL}/404", code=302)

    user = User.query.filter_by(email=old_email).first()
    if not user:
        redirect(f"{Config.BASE_URL}/404", code=302)
    user.email = new_email
    db.session.add(user)
    db.session.commit()

    return redirect(f"{Config.BASE_URL}/profile", code=302)


@bp.route('/files')
def files():
    s3_resource = boto3.resource('s3')
    my_bucket = s3_resource.Bucket(Config.S3_BUCKET_NAME)
    summaries = my_bucket.objects.all()
    for o in summaries:
        print(o.key)
    return {"message": "bucket printed successfully"}, 200


# make changes to an existing user's image
@bp.route('/image', methods=['POST'])
@jwt_required
def edit_image():
    # print(request.files)
    user_id = get_jwt_identity()
    file = request.files['image_url']
    print(file)
    s3_resource = boto3.resource('s3')
    my_bucket = s3_resource.Bucket(Config.S3_BUCKET_NAME)
    my_bucket.Object(file.name).put(Body=file, ACL='public-read')
    user = User.query.filter(User.id == user_id).one()
    if user:
        user.image = f'https://instaharvest.s3.us-east-2.amazonaws.com/{my_bucket.Object(file.filename).key}'
        db.session.commit()
        return {'user': user.to_dict_public()}
    return {'message': 'uploaded'}, 200
