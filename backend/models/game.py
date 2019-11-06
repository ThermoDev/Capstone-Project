from datetime import datetime
from typing import Optional, List

from models.user import User
from models.portfolio import Portfolio


class Game:
    def __init__(self,
                 game_id: Optional[int],
                 name: str,
                 start_date: datetime,
                 end_date: datetime,
                 users: List[User],
                 portfolios: List[Portfolio]):
        self._game_id = game_id
        self._name = name
        self._start_date = start_date
        self._end_date = end_date
        self._users = users
        self._portfolios = portfolios

    @property
    def game_id(self) -> int:
        return self._game_id

    def update_with_generated_id(self, generated_id: int):
        self._game_id = generated_id

    @property
    def name(self) -> str:
        return self._name

    @property
    def start_date(self) -> datetime:
        return self._start_date

    @property
    def end_date(self) -> datetime:
        return self._end_date

    @property
    def users(self) -> List[User]:
        return self._users

    @property
    def portfolios(self) -> List[Portfolio]:
        return self._portfolios

    @property
    def leaderboard(self) -> List[tuple]:
        leaderboard = []
        for portfolio in self.portfolios:
            leaderboard.append((portfolio.holder, portfolio.portfolio_value))

        leaderboard.sort(key=lambda tup: tup[1], reverse=True)

        return leaderboard
