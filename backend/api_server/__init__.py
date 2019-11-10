import os
from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from login.user_manager import UserManager


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, supports_credentials=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'api_server.sqlite'),
        SESSION_COOKIE_HTTPONLY=False,
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/')
    def index():
        return 'Hello, World!'

    from . import db
    db.init_app(app)

    from . import api
    app.register_blueprint(api.bp)

    from backend.data_pipeline import stockendpoint as stkend
    app.register_blueprint(stkend.bp)

    from backend.login import api as login_api
    app.register_blueprint(login_api.bp)

    from backend.data_pipeline import newsendpoint as newsend
    app.register_blueprint(newsend.bp)

    from repository import setup
    setup.init_db()

    login_manager = LoginManager()
    login_manager.init_app(app)
    user_manager = UserManager()

    @login_manager.user_loader
    def load_user(user_id):
        return user_manager.flask_login_get_user(user_id)

    from backend.portfolio import api as portfolio_api
    app.register_blueprint(portfolio_api.bp)

    return app
