from werkzeug.security import generate_password_hash, check_password_hash


class User():
    def __init__(self, user_id: str):
        self._user_id = user_id
        self._first_name = None
        self._last_name = None
        self._email = None
        self._password = None

    def __init__(self, user_id: str, first_name: str, last_name: str, email: str, password: str):
        self._user_id = user_id
        self._first_name = first_name
        self._last_name = last_name
        self._email = email
        self._password = password

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

    def get_id(self) -> str:
        return self.user_id

    @property
    def user_id(self) -> str:
        return self._user_id

    @property
    def first_name(self) -> str:
        return self._first_name

    @property
    def last_name(self) -> str:
        return self._last_name

    @property
    def email(self) -> str:
        return self._email

    @property
    def password(self) -> str:
        return self._password

    @password.setter
    def password(self, password: str):
        self._password = generate_password_hash(password, method='sha256')

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password, password)
