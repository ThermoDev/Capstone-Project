class UserNotFoundError(Exception):
    def __init__(self, user_id):
        self.message = f'No user found with id: {user_id}'
