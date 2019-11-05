import sqlite3
from typing import List

from exception.game.game_not_found_error import GameNotFoundError
from models.game import Game
from models.portfolio import Portfolio
from models.user import User
from repository.base_repository import BaseRepository
from repository.portfolio_repository import PortfolioRepository
from repository.user_repository import UserRepository


class GamesTable:
    TABLE_NAME = 'Games'

    class Columns:
        ID = 'gameID'
        NAME = 'name'
        START_DATE = 'startDate'
        END_DATE = 'endDate'


class MembershipsTable:
    TABLE_NAME = 'GameMemberships'

    class Columns:
        GAME_ID = 'gameID'
        USERNAME = 'username'


class PortfoliosTable:
    TABLE_NAME = 'GamePortfolios'

    class Columns:
        GAME_ID = 'gameID'
        PORTFOLIO_ID = 'portfolioID'


class GameRepository(BaseRepository):
    def __init__(self):
        self._db_path = 'resources/TradiE.db'
        self._user_repository = UserRepository()
        self._portfolio_repository = PortfolioRepository()

    def get_games_for_user(self, user_id: str) -> List[Game]:
        games = []

        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=MembershipsTable.TABLE_NAME,
                                                identifiers=(MembershipsTable.Columns.USERNAME, ))
            output = cursor.execute(query, (user_id, ))
            for row in output:
                game_id = row[0]
                games.append(self.get_game_by_id(game_id))

        return games

    def get_game_by_id(self, game_id: int) -> Game:
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=GamesTable.TABLE_NAME,
                                                identifiers=(GamesTable.Columns.ID, ))
            output = cursor.execute(query, (game_id, ))
            result = output.fetchone()
            if not result:
                raise GameNotFoundError(game_id)

            name = result[1]
            start_date = result[2]
            end_date = result[3]

            users = self._build_users_for_game(game_id)
            portfolios = self._build_portfolios_for_game(game_id)

        return Game(game_id, name, start_date, end_date, users, portfolios)

    def _build_users_for_game(self, game_id: int) -> List[User]:
        usernames = []
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=MembershipsTable.TABLE_NAME,
                                                identifiers=(MembershipsTable.Columns.GAME_ID, ))
            output = cursor.execute(query, (game_id, ))
            for row in output:
                usernames.append(row[1])

        return self._user_repository.get_users_list(usernames)

    def _build_portfolios_for_game(self, game_id: int) -> List[Portfolio]:
        portfolio_ids = []
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=PortfoliosTable.TABLE_NAME,
                                                identifiers=(PortfoliosTable.Columns.GAME_ID, ))
            output = cursor.execute(query, (game_id, ))
            for row in output:
                portfolio_ids.append(row[1])

        return self._portfolio_repository.get_portfolios_list(portfolio_ids)

    def add_game(self, game: Game):
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()

            game_query = self.build_insert_query(table=GamesTable.TABLE_NAME,
                                                 columns=(
                                                     GamesTable.Columns.NAME,
                                                     GamesTable.Columns.START_DATE,
                                                     GamesTable.Columns.END_DATE
                                                 ))
            cursor.execute(game_query, _unpack_game(game))
            game.update_with_generated_id(cursor.lastrowid)

            for user in game.users:
                user_query = self.build_insert_query(table=MembershipsTable.TABLE_NAME,
                                                     columns=(
                                                         MembershipsTable.Columns.GAME_ID,
                                                         MembershipsTable.Columns.USERNAME
                                                     ))
                cursor.execute(user_query, (game.game_id, user.user_id))

            connection.commit()

            for portfolio in game.portfolios:
                portfolio_query = self.build_insert_query(table=PortfoliosTable.TABLE_NAME,
                                                          columns=(
                                                              PortfoliosTable.Columns.GAME_ID,
                                                              PortfoliosTable.Columns.PORTFOLIO_ID
                                                          ))
                cursor.execute(portfolio_query, (game.game_id, portfolio.portfolio_id))


def _unpack_game(game: Game):
    return game.name, game.start_date, game.end_date
