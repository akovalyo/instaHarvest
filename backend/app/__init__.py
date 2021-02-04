from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from app.config import Config
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy()
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

from app.routes import users
from app.routes import auth
from app.routes import account

app.register_blueprint(users.bp)
app.register_blueprint(auth.bp)
app.register_blueprint(account.bp)
