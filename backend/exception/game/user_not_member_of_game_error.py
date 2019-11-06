class UserNotMemberOfGameError(Exception):
    def __init__(self, user_id, game_id):
        self.message = f'User: {user_id} is not a member of game: {game_id}'