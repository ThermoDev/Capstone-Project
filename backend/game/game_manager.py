from repository.game_repository import GameRepository


class GameManager:
    def __init__(self):
        self._game_repository = GameRepository()
