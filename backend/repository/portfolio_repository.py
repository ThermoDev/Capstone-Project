import sqlite3
from typing import List, Optional

from exception.portfolio.portfolio_not_found_error import PortfolioNotFoundError
from models.game import Game
from models.portfolio import Portfolio
from models.stock_transaction import StockTransaction
from repository.base_repository import BaseRepository


class PortfoliosTable:
    TABLE_NAME = 'Portfolios'

    class Columns:
        ID = 'portfolioID'
        HOLDER = 'holder'
        NAME = 'name'
        CASH = 'cash'


class TransactionsTable:
    TABLE_NAME = 'Transactions'

    class Columns:
        ID = 'transactionID'
        PORTFOLIO_ID = 'portfolioID'
        COMPANY_CODE = 'companyCode'
        PRICE = 'price'
        VOLUME = 'volume'
        TRANSACTION_TIME = 'transactionTime'


class GameMemberships:
    TABLE_NAME = 'GamePortfolios'

    class Columns:
        GAME_ID = 'gameID'
        PORTFOLIO_ID = 'portfolioID'


class PortfolioRepository(BaseRepository):
    def __init__(self):
        self._db_path = 'resources/TradiE.db'

    def get_all_portfolios_for_user(self, user_id: str) -> [Portfolio]:
        portfolios = []

        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=PortfoliosTable.TABLE_NAME,
                                                identifiers=(PortfoliosTable.Columns.HOLDER, ))
            output = cursor.execute(query, (user_id, ))

            for row in output:
                portfolios.append(self._build_portfolio_from_cursor_output(row))

        return portfolios

    def get_portfolio_by_id(self, portfolio_id: int) -> Portfolio:
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=PortfoliosTable.TABLE_NAME,
                                                identifiers=(PortfoliosTable.Columns.ID, ))
            output = cursor.execute(query, (portfolio_id, ))
            result = output.fetchone()
            if not result:
                raise PortfolioNotFoundError(portfolio_id)

            return self._build_portfolio_from_cursor_output(result)

    def get_portfolios_list(self, portfolio_ids: List[str]) -> List[Portfolio]:
        portfolios = []

        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_list_query(table=PortfoliosTable.TABLE_NAME,
                                                     identifier=PortfoliosTable.Columns.ID,
                                                     num=len(portfolio_ids))
            output = cursor.execute(query, tuple(portfolio_ids))
            for row in output:
                portfolios.append(self._build_portfolio_from_cursor_output(row))

        return portfolios

    def _build_portfolio_from_cursor_output(self, output_row) -> Portfolio:
        portfolio_id = output_row[0]
        holder = output_row[1]
        name = output_row[2]
        cash = output_row[3]
        stock_transactions = self._build_stock_transactions_for_portfolio(portfolio_id)

        return Portfolio(portfolio_id, holder, name, cash, stock_transactions)

    def _build_stock_transactions_for_portfolio(self, portfolio_id) -> List[StockTransaction]:
        stock_transactions = []

        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=TransactionsTable.TABLE_NAME,
                                                identifiers=(TransactionsTable.Columns.PORTFOLIO_ID, ))
            output = cursor.execute(query, (portfolio_id, ))
            for row in output:
                stock_transactions.append(StockTransaction(*row))

        return stock_transactions

    def has_portfolio_by_user_and_name(self, user_id: str, name: str) -> bool:
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=PortfoliosTable.TABLE_NAME,
                                                identifiers=(
                                                    PortfoliosTable.Columns.HOLDER,
                                                    PortfoliosTable.Columns.NAME
                                                ))
            output = cursor.execute(query, (user_id, name))
            result = output.fetchone()

            return bool(result)

    def add_portfolio(self, portfolio: Portfolio):
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_insert_query(table=PortfoliosTable.TABLE_NAME,
                                            columns=(
                                                PortfoliosTable.Columns.HOLDER,
                                                PortfoliosTable.Columns.NAME,
                                                PortfoliosTable.Columns.CASH
                                            ))
            cursor.execute(query, _unpack_portfolio(portfolio))
            connection.commit()
            portfolio.update_with_generated_id(cursor.lastrowid)

    def update_portfolio(self, portfolio: Portfolio):
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            portfolio_query = self.build_replace_query(table=PortfoliosTable.TABLE_NAME,
                                                       columns=(
                                                          PortfoliosTable.Columns.ID,
                                                          PortfoliosTable.Columns.HOLDER,
                                                          PortfoliosTable.Columns.NAME,
                                                          PortfoliosTable.Columns.CASH
                                                        ))
            cursor.execute(portfolio_query,
                           (portfolio.portfolio_id, *_unpack_portfolio(portfolio)))

            for stock_transaction in portfolio.stock_transactions:
                if not stock_transaction.transaction_id:
                    transaction_query = self.build_insert_query(table=TransactionsTable.TABLE_NAME,
                                                                columns=(
                                                                    TransactionsTable.Columns.PORTFOLIO_ID,
                                                                    TransactionsTable.Columns.COMPANY_CODE,
                                                                    TransactionsTable.Columns.PRICE,
                                                                    TransactionsTable.Columns.VOLUME,
                                                                    TransactionsTable.Columns.TRANSACTION_TIME
                                                                ))
                    cursor.execute(transaction_query, _unpack_transaction(stock_transaction))
                    connection.commit()
                    stock_transaction.update_with_generated_id(cursor.lastrowid)

    def get_game_id_for_portfolio_id(self, portfolio_id: int) -> Optional[int]:
        with sqlite3.connect(self._db_path) as connection:
            cursor = connection.cursor()
            query = self.build_select_all_query(table=GameMemberships.TABLE_NAME,
                                                identifiers=(GameMemberships.Columns.PORTFOLIO_ID, ))
            cursor.execute(query, (portfolio_id, ))
            result = cursor.fetchone()
            if result:
                return result[0]
            else:
                return None


def _unpack_portfolio(portfolio: Portfolio) -> tuple:
    return portfolio.holder, portfolio.name, portfolio._initial_cash


def _unpack_transaction(transaction: StockTransaction) -> tuple:
    return (transaction.portfolio_id,
            transaction.company_code,
            transaction.price,
            transaction.volume,
            transaction.transaction_time)
