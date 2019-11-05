from repository.base_repository import BaseRepository


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
