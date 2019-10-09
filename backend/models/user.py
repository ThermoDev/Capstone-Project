from werkzeug.security import generate_password_hash, check_password_hash


class User():
    def __init__(self, user_id: str):
        self._user_id = user_id
        self._password = None

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

    def get_id(self) -> str:
        return self.user_id

    @property
    def user_id(self):
        return self._user_id

    @property
    def password(self) -> str:
        return self._password

    @password.setter
    def password(self, password: str):
        self._password = generate_password_hash(password, method='sha256')

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password, password)
