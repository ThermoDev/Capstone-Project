from typing import List, Optional

from exception.portfolio.insufficient_cash_error import InsufficientCashError
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
        amount_invested = 0
        for stock_holding in self._stock_holdings:
            amount_invested += stock_holding.amount_invested

        return amount_invested

    @property
    def stock_transactions(self) -> List[StockTransaction]:
        return self._stock_transactions

    def update_with_generated_id(self, generated_id: int):
        self._portfolio_id = generated_id

    def process_transaction(self, transaction: StockTransaction):
        cash_required = transaction.volume * transaction.price
        if self.cash < cash_required:
            raise InsufficientCashError(self.portfolio_id)

        self._cash -= cash_required
        self._stock_transactions.append(transaction)

        self._update_stock_holdings(transaction)

    def _build_stock_holdings(self):
        for transaction in self._stock_transactions:
            self._update_stock_holdings(transaction)

    def _update_stock_holdings(self, transaction):
        pass
        #TODO: Get existing stock holding and make it process transaction
