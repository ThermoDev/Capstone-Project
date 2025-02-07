from exception.user.user_already_exists_error import UserAlreadyExistsError
from exception.user.user_not_found_error import UserNotFoundError
from flask import (
    Blueprint, request, Response, jsonify
)
from flask_login import login_user, logout_user, login_required
from login.user_manager import UserManager
from utils.serialiser import serialise_properties

bp = Blueprint('login', __name__, url_prefix='/login')

user_manager = UserManager()

# Login Routes
@bp.route('', methods=['POST'])
def login():
    user_id = request.json.get('user_id')
    password = request.json.get('password')
    try:
        user = user_manager.get_user(user_id)
    except UserNotFoundError as e:
        return Response(response=e.message, status=401)

    if user.check_password(password):
        login_user(user)
        response = serialise_properties(user)

        return jsonify(response), 200

    return Response(response="Authentication failed.", status=401)


@bp.route('/register', methods=['POST'])
def register():
    user_id = request.json.get('user_id')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    email = request.json.get('email')
    password = request.json.get('password')
    try:
        user = user_manager.create_new_user(user_id, first_name, last_name, email, password)
    except UserAlreadyExistsError as e:
        return Response(response=e.message, status=409)

    response = serialise_properties(user)

    return jsonify(response), 201


@bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return Response(response="Logout successful.", status=200)


@bp.route('/check-user', methods=['POST'])
@login_required
def check_user():
    user_id = request.json.get('user_id')

    return jsonify(user_manager.check_user(user_id)), 200


@bp.route('/all-users', methods=['GET'])
@login_required
def get_all_users():
    return jsonify(user_manager.get_all_usernames()), 200
