from datetime import datetime
from typing import List

from exception.game.user_not_member_of_game_error import UserNotMemberOfGameError
from login.user_manager import UserManager
from models.game import Game
from portfolio.portfolio_manager import PortfolioManager
from repository.game_repository import GameRepository


class GameManager:
    def __init__(self):
        self._game_repository = GameRepository()

        self._user_manager = UserManager()
        self._portfolio_manager = PortfolioManager()

    def get_games_for_user(self, user_id: str) -> List[Game]:
        return self._game_repository.get_games_for_user(user_id)

    def get_game_for_user_by_id(self, user_id: str, game_id: int) -> Game:
        game = self._game_repository.get_game_by_id(game_id)
        if user_id not in [user.user_id for user in game.users]:
            raise UserNotMemberOfGameError(user_id, game_id)

        return game

    def create_game(self, name: str, start_date: datetime, end_date: datetime, usernames: List[str], initial_cash: int):
        users = self._user_manager.get_users_list(usernames)

        portfolios = []
        for user in users:
            portfolio = self._portfolio_manager.create_portfolio_for_user(user.user_id,
                                                                          f'{name} (Game)',
                                                                          initial_cash)
            portfolios.append(portfolio)

        game = Game(None, name, start_date, end_date, users, portfolios)
        self._game_repository.add_game(game)

        return game
