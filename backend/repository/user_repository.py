from typing import List

from backend.models.user import User
from exception.user.user_not_found_error import UserNotFoundError
import os

import sqlite3

from repository.base_repository import BaseRepository


class UsersTable:
    TABLE_NAME = 'Users'

    class Columns:
        USERNAME = 'username'
        FIRST_NAME = 'firstName'
        LAST_NAME = 'lastName'
        EMAIL = 'email'
        PASSWORD = 'password'


class UserRepository(BaseRepository):
    def __init__(self):
        self._db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'resources/TradiE.db')

    def get_user(self, user_id: str) -> User:
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=UsersTable.TABLE_NAME,
                                                identifiers=(UsersTable.Columns.USERNAME, ))
            output = cursor.execute(query, (user_id, ))
            result = output.fetchone()
            if not result:
                raise UserNotFoundError(user_id)

            return User(*result)

    def get_users_list(self, usernames: List[str]) -> List[User]:
        users = []

        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_list_query(table=UsersTable.TABLE_NAME,
                                                     identifier=UsersTable.Columns.USERNAME,
                                                     num=len(usernames))
            output = cursor.execute(query, tuple(usernames))
            for row in output:
                users.append(User(*row))

        return users

    def has_user(self, user_id: str) -> bool:
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=UsersTable.TABLE_NAME,
                                                identifiers=(UsersTable.Columns.USERNAME, ))
            output = cursor.execute(query, (user_id, ))
            result = output.fetchone()

            return bool(result)

    def add_user(self, user: User):
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_insert_query(table=UsersTable.TABLE_NAME,
                                            columns=(
                                                UsersTable.Columns.USERNAME,
                                                UsersTable.Columns.FIRST_NAME,
                                                UsersTable.Columns.LAST_NAME,
                                                UsersTable.Columns.EMAIL,
                                                UsersTable.Columns.PASSWORD,
                                            ))
            cursor.execute(query, _unpack_user(user))
            connection.commit()

    def update_user(self, user: User):
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_replace_query(table=UsersTable.TABLE_NAME,
                                             columns=(
                                                 UsersTable.Columns.USERNAME,
                                                 UsersTable.Columns.FIRST_NAME,
                                                 UsersTable.Columns.LAST_NAME,
                                                 UsersTable.Columns.EMAIL,
                                                 UsersTable.Columns.PASSWORD,
                                             ))
            cursor.execute(query, _unpack_user(user))
            connection.commit()


def _unpack_user(user: User) -> tuple:
    return user.user_id, user.first_name, user.last_name, user.email, user.password
