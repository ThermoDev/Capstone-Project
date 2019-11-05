import re
from datetime import datetime
from typing import Optional

from data_pipeline import stockhelper
from exception.game.game_ended_transaction_error import GameEndedTransactionError
from exception.portfolio.invalid_transaction_price_error import InvalidTransactionPriceError
from exception.portfolio.portfolio_access_denied_error import PortfolioAccessDeniedError
from game.game_manager import GameManager
from models.portfolio import Portfolio
from models.stock_transaction import StockTransaction
from repository.portfolio_repository import PortfolioRepository


class PortfolioManager:
    def __init__(self):
        self._portfolio_repository = PortfolioRepository()

        self._game_manager = GameManager()

    def get_all_portfolios_for_user(self, user_id: str) -> [Portfolio]:
        return self._portfolio_repository.get_all_portfolios_for_user(user_id)

    def get_portfolio_for_user_by_id(self, user_id: str, portfolio_id: int) -> Portfolio:
        portfolio = self._portfolio_repository.get_portfolio_by_id(portfolio_id)
        if portfolio.holder != user_id:
            raise PortfolioAccessDeniedError(user_id, portfolio_id)

        return portfolio

    def create_portfolio_for_user(self, user_id: str, name: str, cash: int = 0) -> Portfolio:
        if self._portfolio_repository.has_portfolio_by_user_and_name(user_id, name):
            match = re.search(r'(.*\()([0-9]+)\)', name)
            if match:
                new_name = f'{match.group(1)}{int(match.group(2)) + 1})'
            else:
                new_name = f'{name} (2)'

            return self.create_portfolio_for_user(user_id, new_name, cash)

        portfolio = Portfolio(None, user_id, name, cash, [])
        self._portfolio_repository.add_portfolio(portfolio)

        return portfolio

    def process_transaction(self,
                            user_id: str,
                            portfolio_id: int,
                            company_code: str,
                            price: float,
                            volume: int,
                            transaction_time: Optional[datetime]
                            ) -> Portfolio:
        portfolio = self.get_portfolio_for_user_by_id(user_id, portfolio_id)
        if not transaction_time:
            transaction_time = datetime.now()
        transaction = StockTransaction(None, portfolio_id, company_code, price, volume, transaction_time)
        self._validate_transaction(user_id, transaction)

        portfolio.process_transaction(transaction)

        self._portfolio_repository.update_portfolio(portfolio)

        return portfolio

    def _validate_transaction(self, user_id: str, transaction: StockTransaction):
        game_id = self._portfolio_repository.get_game_id_for_portfolio_id(transaction.portfolio_id)
        if game_id:
            game = self._game_manager.get_game_for_user_by_id(user_id, game_id)
            if datetime.now() > game.end_date:
                raise GameEndedTransactionError(game.name)

            if transaction.price == stockhelper.get_cur_close_price(transaction.company_code):
                raise InvalidTransactionPriceError(transaction.company_code, transaction.price)
