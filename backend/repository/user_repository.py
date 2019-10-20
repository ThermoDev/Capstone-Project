from backend.models.user import User
from exception.user.user_not_found_error import UserNotFoundError

import sqlite3


class UserRepository:
    def __init__(self):
        self._connection = sqlite3.connect('resources/TradiE.db')

    def get_user(self, user_id: str) -> User:
        cursor = self._connection.cursor()
        output = cursor.execute(f'SELECT * FROM User WHERE username="{user_id}"')
        result = output.fetchone()
        if not result:
            raise UserNotFoundError(user_id)

        return User(*result)

    def has_user(self, user_id: str) -> bool:
        cursor = self._connection.cursor()
        output = cursor.execute(f'SELECT * FROM User WHERE username="{user_id}"')
        result = output.fetchone()

        return bool(result)

    def add_user(self, user: User):
        cursor = self._connection.cursor()
        cursor.execute(f'INSERT INTO User VALUES ({self._unpack_user_for_insert(user)})')
        self._connection.commit()

    def update_user(self, user: User):
        cursor = self._connection.cursor()
        cursor.execute(f'UPDATE User Set {self._unpack_user_for_update(user)}')
        self._connection.commit()

    @staticmethod
    def _unpack_user_for_insert(user: User) -> str:
        return f'"{user.user_id}", "{user.first_name}", "{user.last_name}", "{user.email}", "{user.password}"'

    @staticmethod
    def _unpack_user_for_update(user: User) -> str:
        return (f'user_id="{user.user_id}", '
                f'first_name="{user.first_name}", '
                f'last_name="{user.last_name}", '
                f'email="{user.email}", '
                f'password="{user.password}"')
