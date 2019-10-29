from datetime import datetime

from data_pipeline import stockhelper
from exception.portfolio.insufficient_cash_error import InsufficientCashError
from exception.portfolio.invalid_transaction_price_error import InvalidTransactionPriceError
from exception.portfolio.portfolio_access_denied_error import PortfolioAccessDeniedError
from exception.portfolio.portfolio_already_exists_error import PortfolioAlreadyExistsError
from models.portfolio import Portfolio
from models.stock_transaction import StockTransaction
from repository.portfolio_repository import PortfolioRepository


class PortfolioManager:
    def __init__(self):
        self._portfolio_repository = PortfolioRepository()

    def get_all_portfolios_for_user(self, user_id: str) -> [Portfolio]:
        return self._portfolio_repository.get_all_portfolios_for_user(user_id)

    def get_portfolio_for_user_by_id(self, user_id: str, portfolio_id: int) -> Portfolio:
        portfolio = self._portfolio_repository.get_portfolio_by_id(portfolio_id)
        if portfolio.holder != user_id:
            raise PortfolioAccessDeniedError(user_id, portfolio_id)

        return portfolio

    def create_portfolio_for_user(self, user_id: str, name: str, cash: int = 0) -> Portfolio:
        if self._portfolio_repository.has_portfolio_by_user_and_name(user_id, name):
            raise PortfolioAlreadyExistsError(user_id, name)

        portfolio = Portfolio(None, user_id, name, cash, [])
        self._portfolio_repository.add_portfolio(portfolio)

        return portfolio

    def process_transaction(self,
                            user_id: str,
                            portfolio_id: int,
                            company_code: str,
                            price: float,
                            volume: int
                            ) -> Portfolio:
        portfolio = self.get_portfolio_for_user_by_id(user_id, portfolio_id)
        transaction = StockTransaction(None, portfolio_id, company_code, price, volume, datetime.now())
        if not _validate_transaction_price(transaction):
            raise InvalidTransactionPriceError(transaction.company_code, transaction.price)

        try:
            portfolio.process_transaction(transaction)
        except InsufficientCashError as e:
            raise e

        self._portfolio_repository.update_portfolio(portfolio)

        return portfolio


def _validate_transaction_price(transaction: StockTransaction) -> bool:
    return transaction.price == stockhelper.get_cur_close_price(transaction.company_code)
