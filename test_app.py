import os
import tempfile
import pytest
from app import create_app, db
from app.config import Config
from app.models import User
from flask import Flask, session, current_app
from datetime import datetime


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = Config.DATABASE_TEST
    SEND_CONFIRM_EMAIL = False


USER1 = "test"
EMAIL1 = "test@test.com"
USER2 = "test2"
EMAIL2 = "test2@test.com"
PASSWORD = "123456"


@pytest.fixture
def client():
    app = create_app(TestConfig)
    app_context = app.app_context()
    app_context.push()
    db.create_all()
    user = User(username=USER1,
                first_name="Name1",
                password="123456",
                email=EMAIL1,
                email_verified=False,
                image_url=app.config["PROFILE_IMAGE"],
                image_back_url=app.config["PROFILE_BACK_IMAGE"],
                state="California",
                city="Fremont",
                profile_addr="name",
                confirm_email_sent=datetime.utcnow())
    db.session.add(user)
    db.session.commit()

    with app.test_client() as client:
        yield client

    db.session.remove()
    db.drop_all()
    app_context.pop()


def login(client, login, password):
    return client.post("/api/auth/login", json={"login": login, "password": password})


def logout(client):
    return client.post("/api/auth/logout")


def signup(client, username, email, password):
    return client.post('/api/auth/signup', json={"email": email,
                                                 "password": password,
                                                 "username": username,
                                                 "first_name": "Name2",
                                                 "state": "California",
                                                 "city": "Fremont"})


def test_signup(client):
    # Correct signup
    rv = signup(client, USER2, EMAIL2, PASSWORD)
    resp = rv.get_json()
    assert resp["created_at"][:4] == "2021"
    assert resp["city"] == "Fremont"
    assert resp["email_verified"] == False
    assert resp["first_name"] == "Name2"
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["us_state"] == "California"

    # Existing username
    rv = signup(client, USER2, "user3@test.com", PASSWORD)
    assert rv.status[:3] == "409"
    assert rv.get_json()[
        "error"] == f"The user with username {USER2} already exists"

    # Existing email
    rv = signup(client, "user3", EMAIL2, PASSWORD)
    assert rv.status[:3] == "409"
    assert rv.get_json()[
        "error"] == f"The user with email {EMAIL2} already exists"


def test_login_logout(client):
    # Existing user, wrong password
    rv = login(client, USER1, "123")
    assert rv.status[:3] == "401"
    assert rv.get_json()["error"] == "Wrong password"

    # Wrong username
    rv = login(client, "user3", PASSWORD)
    assert rv.status[:3] == "401"
    assert rv.get_json()[
        "error"] == "The user with username user3 does not exist"

    # Wrong email
    rv = login(client, "user3@test.com", PASSWORD)
    assert rv.status[:3] == "401"
    assert rv.get_json()[
        "error"] == "The user with email user3@test.com does not exist"

    # Existing user, login with username, correct password
    rv = login(client, USER1, PASSWORD)
    resp = rv.get_json()
    assert rv.status[:3] == "200"
    assert resp["created_at"][:4] == "2021"
    assert resp["city"] == "Fremont"
    assert resp["email_verified"] == False
    assert resp["first_name"] == "Name1"
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["us_state"] == "California"
    assert session["id"] == 1

    # Logout
    rv = logout(client)
    assert rv.status[:3] == "200"
    assert session.get('id', False) == False

    # Existing user, login with email, correct password
    rv = login(client, EMAIL1, PASSWORD)
    resp = rv.get_json()
    assert rv.status[:3] == "200"
    assert resp["created_at"][:4] == "2021"
    assert resp["city"] == "Fremont"
    assert resp["email_verified"] == False
    assert resp["first_name"] == "Name1"
    assert resp["image_back_url"] == current_app.config["PROFILE_BACK_IMAGE"]
    assert resp["image_url"] == current_app.config["PROFILE_IMAGE"]
    assert resp["us_state"] == "California"
    assert session["id"] == 1


def test_reset_password(client):
    rv = client.post("/api/auth/reset_password",
                     json={"email": "user3@test.com"})
    assert rv.status[:3] == "401"
    assert rv.get_json()[
        "error"] == "The user with email user3@test.com does not exist"

    rv = client.post('/api/auth/reset_password', json={"email": EMAIL1})
    assert rv.status[:3] == "200"
    assert rv.get_json()[
        "msg"] == "A reset password email has been sent"


def test_resend_email(client):
    login(client, USER1, PASSWORD)
    rv = client.post("/api/auth/resend_email")
    assert rv.status[:3] == "406"
    resp = rv.get_json()[
        "error"]
    assert "Sorry, you can resend confirmation email in" in resp