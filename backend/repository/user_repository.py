from backend.models.user import User
from exception.user.user_not_found_error import UserNotFoundError


class UserRepository:
    def __init__(self):
        #TODO establish DB connection

        user1234 = User('1234')
        user1234.password = 'bleargh'

        user5678 = User('5678')
        user5678.password = 'foobar'
        self._users = {
            '1234': user1234,
            '5678': user5678
        }

    def get_user(self, user_id: str) -> User:
        try:
            return self._users[user_id]
        except KeyError:
            raise UserNotFoundError(user_id)

    def has_user(self, user_id: str) -> bool:
        return user_id in self._users

    def add_user(self, user: User):
        self._users[user.user_id] = user
