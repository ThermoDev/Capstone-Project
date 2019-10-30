from typing import List, Optional

from exception.portfolio.insufficient_cash_error import InsufficientCashError
from exception.portfolio.exceed_stock_holding_volume_error import ExceedStockHoldingVolumeError
from exception.portfolio.no_holdings_in_portfolio_error import NoHoldingsInPortfolio
from models.stock_holding import StockHolding
from models.stock_transaction import StockTransaction


class Portfolio:
    """
    A class used to represent a stock portfolio

    ...
    Attributes
    ----------
    _portfolio_id: `int`
        The unique id key of the portfolio
    _holder: `str`
        The username of the holder of the portfolio
    _name: `str`
        The name of the portfolio
    _cash: `float`
        The available cash in the portfolio
    _stock_transactions: `list` of `StockTransaction`
        A history of stock transactions that have taken place for each stock
    _stock_holdings: `dict` from `str` to `StockHolding`
        Maps company code to StockHolding object
    """
    def __init__(self,
                 portfolio_id: Optional[int],
                 holder: str,
                 name: str,
                 cash: float,
                 stock_transactions: List[StockTransaction]):
        self._portfolio_id = portfolio_id
        self._holder = holder
        self._name = name
        self._cash = cash
        self._stock_transactions = stock_transactions

        self._stock_holdings = {}
        self._build_stock_holdings()

    @property
    def portfolio_id(self) -> int:
        return self._portfolio_id

    @property
    def holder(self) -> str:
        return self._holder

    @property
    def name(self) -> str:
        return self._name

    @property
    def cash(self) -> float:
        return self._cash

    @property
    def amount_invested(self) -> float:
        return sum(stock_holding.amount_invested for stock_holding in self.stock_holdings.values())

    @property
    def stock_transactions(self) -> List[StockTransaction]:
        return self._stock_transactions

    @property
    def stock_holdings(self) -> dict:
        return self._stock_holdings

    @property
    def portfolio_value(self) -> float:
        return sum(stock_holding.market_value for stock_holding in self.stock_holdings.values())

    @property
    def portfolio_return(self) -> float:
        return sum(stock_holding.return_value for stock_holding in self.stock_holdings.values())

    @property
    def percentage_growth(self) -> float:
        return self.portfolio_return / self.amount_invested

    @property
    def stock_weightings(self) -> dict:
        total_invested = self.amount_invested

        weightings = {}
        for company_code, stock_holding in self._stock_holdings.items():
            weightings[company_code] = stock_holding.amount_invested / total_invested

        return weightings

    def update_with_generated_id(self, generated_id: int):
        self._portfolio_id = generated_id

    def process_transaction(self, transaction: StockTransaction):
        cash_required = transaction.volume * transaction.price
        if self.cash < cash_required:
            raise InsufficientCashError(self.portfolio_id)

        if transaction.volume < 0:
            if transaction.company_code not in self._stock_holdings:
                raise NoHoldingsInPortfolio(self.portfolio_id, transaction.company_code)
            elif self.stock_holdings[transaction.company_code].volume + transaction.volume < 0:
                raise ExceedStockHoldingVolumeError(self.portfolio_id, transaction.company_code)

        self._cash -= cash_required
        self._stock_transactions.append(transaction)

        self._update_stock_holdings(transaction)

    def _build_stock_holdings(self):
        for transaction in self._stock_transactions:
            self._update_stock_holdings(transaction)

    def _update_stock_holdings(self, transaction):
        company_code = transaction.company_code
        stock_holding = self._stock_holdings.setdefault(company_code, StockHolding(company_code))
        stock_holding.add_transaction(transaction)
