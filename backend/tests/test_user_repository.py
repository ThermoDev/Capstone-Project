import sqlite3
import unittest
from models.user import User
from repository.user_repository import UserRepository
from werkzeug.security import generate_password_hash


class TestUserRepository(UserRepository):
    def __init__(self):
        super().__init__()
        self._db_path = 'temp/db'

class UserRepositoryTests(unittest.TestCase):
    user_repository = TestUserRepository()

    def setUp(self) -> None:
        with sqlite3.connect('temp/db') as connection:
            cursor = connection.cursor()
            cursor.execute('''DROP TABLE IF EXISTS Users''')
            cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
                            username varchar(50) PRIMARY KEY not null,
                            firstName text, 
                            lastName text,
                            email text,
                            password varchar(200))
                        ''')
            cursor.execute('''INSERT INTO Users VALUES (?, ?, ?, ?, ?)''',
                           ('test', 'Martin', 'Le', 'minh.le023@gmail.com',
                            generate_password_hash('test', method='sha256')))
            connection.commit()

    def test_get_user(self):
        user = self.user_repository.get_user('test')

        self.assertEqual(user.user_id, 'test')
        self.assertEqual(user.first_name, 'Martin')
        self.assertEqual(user.last_name, 'Le')
        self.assertEqual(user.email, 'minh.le023@gmail.com')
        self.assertEqual(user.check_password('test'), True)

    def test_add_user(self):
        user = User('MWanggg', 'Manlin', 'Wang', 'mwang@lol.com.au', None)
        user.password = '1234'
        self.user_repository.add_user(user)

        user = self.user_repository.get_user('MWanggg')
        self.assertEqual(user.user_id, 'MWanggg')
        self.assertEqual(user.first_name, 'Manlin')
        self.assertEqual(user.last_name, 'Wang')
        self.assertEqual(user.email, 'mwang@lol.com.au')
        self.assertEqual(user.check_password('1234'), True)

    def test_has_user(self):
        user = User('karlmcgee', 'Karl', 'McGee', 'kMcGee@gmail.com', None)
        user.password = 'km1234'
        self.user_repository.add_user(user)

        self.assertEqual(self.user_repository.has_user('karlmcgee'), True)

    def test_update_user(self):

        user = User('test', 'Martin', 'Le', 'martinle@gmail.com', None)
        user.password = 'ABCD'
        self.user_repository.update_user(user)

        user = self.user_repository.get_user('test')
        self.assertEqual(user.user_id, 'test')
        self.assertEqual(user.first_name, 'Martin')
        self.assertEqual(user.last_name, 'Le')
        self.assertEqual(user.email, 'martinle@gmail.com')
        self.assertEqual(user.check_password('ABCD'), True)


unittest.main()