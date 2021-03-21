from flask import Flask, send_from_directory
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from app.config import Config
from logging.config import dictConfig
import boto3

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {
        'default': {
            'class': 'logging.StreamHandler',
            'formatter': 'default',
            'level': 'INFO'
        },
        'toFile': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'formatter': 'default',
            'filename': 'errors.log',
            'maxBytes': 1024 * 1000,
            'backupCount': 20
        }
    },
    'root': {
        'handlers': ['toFile']
    }
})


s3_resource = boto3.resource(
    "s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY
)


app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config.from_object(Config)
db = SQLAlchemy()
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
mail = Mail(app)


@app.route('/', defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")


from app.routes import users, auth, account, chat, products

app.register_blueprint(users.bp)
app.register_blueprint(auth.bp)
app.register_blueprint(account.bp)
app.register_blueprint(products.bp)
app.register_blueprint(chat.bp)
# app.register_blueprint(cert.bp)
