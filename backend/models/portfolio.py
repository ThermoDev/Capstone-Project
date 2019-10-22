from typing import List, Optional

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
    """
    def __init__(self, portfolio_id: Optional[int], holder: str, name: str, cash: float, stock_transactions: List[StockTransaction]):
        self._portfolio_id = portfolio_id
        self._holder = holder
        self._name = name
        self._cash = cash
        self._stock_transactions = stock_transactions

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
    def stock_transactions(self) -> List[StockTransaction]:
        return self._stock_transactions
