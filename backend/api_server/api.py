from exception.user.user_already_exists_error import UserAlreadyExistsError
from flask import (
    Blueprint, request, jsonify
)
from flask_login import login_user
from login.user_manager import UserManager

# IMPORT FUNCTIONS HERE
user_manager = UserManager()

bp = Blueprint('api', __name__, url_prefix='/api/v1')

# NEW ROUTES HERE
@bp.route('/', methods=['GET'])
def index():
    return jsonify({
        "username": "martinle",
        "password": "redshiba",
        "portfolio": [
            'GOOG',
            'AMZN',
            'AAPL',
            'MSFT'
        ]
    })

# Login Routes
@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return "Insert frontend form to login here"
    elif request.method == 'POST':
        user_id = request.form.get('user_id')
        password = request.form.get('password')
        user = user_manager.get_user(user_id)
        if user:
            if user.check_password(password):
                login_user(user)
                return "Login successful"

        return "Login failed"

@bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return "Insert frontend form to signup here"
    elif request.method =='POST':
        user_id = request.form.get('user_id')
        password = request.form.get('password')
        try:
            user_manager.create_new_user(user_id, password)
        except UserAlreadyExistsError:
            return "Username unavailable"

        return "Signed up"
