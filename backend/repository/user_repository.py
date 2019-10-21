from backend.models.user import User
from exception.user.user_not_found_error import UserNotFoundError

import sqlite3


class UserRepository:
    def __init__(self):
        self._db_path = 'resources/TradiE.db'

    def get_user(self, user_id: str) -> User:
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            output = cursor.execute('SELECT * FROM User WHERE username=?', (user_id, ))
            result = output.fetchone()
            if not result:
                raise UserNotFoundError(user_id)

            return User(*result)

    def has_user(self, user_id: str) -> bool:
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            output = cursor.execute('SELECT * FROM User WHERE username=?', (user_id, ))
            result = output.fetchone()

            return bool(result)

    def add_user(self, user: User):
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            cursor.execute('INSERT INTO User VALUES (?, ?, ?, ?, ?)', self._unpack_user(user))
            connection.commit()

    def update_user(self, user: User):
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            cursor.execute('UPDATE User SET user_id=?, first_name=?, last_name=?, email=?, password=?',
                           self._unpack_user(user))
            connection.commit()

    @staticmethod
    def _unpack_user(user: User) -> tuple:
        return user.user_id, user.first_name, user.last_name, user.email, user.password
