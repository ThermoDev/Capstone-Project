class GameNotFoundError(Exception):
    def __init__(self, game_id):
        self.message = f'No game found with ID: {game_id}'