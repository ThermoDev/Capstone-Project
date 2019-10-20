from exception.user.user_already_exists_error import UserAlreadyExistsError
from flask import (
    Blueprint, request, Response
)
from flask_login import login_user, logout_user
from login.user_manager import UserManager

bp = Blueprint('login', __name__, url_prefix='/login')

user_manager = UserManager()

# Login Routes
@bp.route('', methods=['POST'])
def login():
    user_id = request.form.get('user_id')
    password = request.form.get('password')
    user = user_manager.get_user(user_id)
    if user:
        if user.check_password(password):
            login_user(user)
            return Response(response="Login successful.", status=200)

    return Response(response="Authentication failed.", status=401)


@bp.route('/register', methods=['POST'])
def register():
    user_id = request.form.get('user_id')
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')
    password = request.form.get('password')
    try:
        user_manager.create_new_user(user_id, first_name, last_name, email, password)
    except UserAlreadyExistsError:
        return Response(response="Username unavailable.", status=409)

    return Response(response="Registration successful.", status=201)

@bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return Response(response="Logout successful.", status=200)
