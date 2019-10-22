from exception.portfolio.portfolio_access_denied_error import PortfolioAccessDeniedError
from exception.portfolio.portfolio_already_exists_error import PortfolioAlreadyExistsError
from models.portfolio import Portfolio
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
