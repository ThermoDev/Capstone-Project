from typing import Optional

from exception.user.user_already_exists_error import UserAlreadyExistsError
from exception.user.user_not_found_error import UserNotFoundError
from models.user import User
from repository.user_repository import UserRepository


class UserManager:
    def __init__(self):
        self._user_repository = UserRepository()

    def flask_login_get_user(self, user_id: str) -> Optional[User]:
        try:
            return self.get_user(user_id)
        except UserNotFoundError:
            return None

    def get_user(self, user_id: str) -> User:
        try:
            return self._user_repository.get_user(user_id)
        except UserNotFoundError as e:
            raise e

    def create_new_user(self, user_id: str, first_name: str, last_name: str, email: str, password: str) -> User:
        if self._user_repository.has_user(user_id):
            raise UserAlreadyExistsError(user_id)

        user = User(user_id, first_name, last_name, email, None)
        user.password = password
        self._user_repository.add_user(user)

        return user
