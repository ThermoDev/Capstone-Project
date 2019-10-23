class UserAlreadyExistsError(Exception):
    def __init__(self, user_id):
        self.message = f'User already exists with id: {user_id}'
