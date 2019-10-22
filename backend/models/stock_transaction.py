from datetime import datetime
from typing import Optional


class StockTransaction:
    """
    A class used to represent the buying or selling of a stock in a portfolio.

    ...
    Attributes
    ----------
    transaction_id: `int`
        The unique id key of the transaction
    portfolio_id: `int`
        The portfolio id that transaction belongs to
    company_code: `str`
        The company code of the stock
    price: `int`
        The price at which the stock was bought or sold
    volume: `int`
        The volume of the stock bought or sold - can be negative but must be non-zero
    transaction_time: `datetime`
        The datetime of the transaction
    """
    def __init__(self,
                 transaction_id: Optional[int],
                 portfolio_id: int,
                 company_code: str,
                 price: float,
                 volume: int,
                 transaction_time: datetime):
        self._transaction_id = transaction_id
        self._portfolio_id = portfolio_id
        self._company_code = company_code
        self._price = price
        self._volume = volume
        self._transaction_time = transaction_time

    @property
    def transaction_id(self) -> int:
        return self._transaction_id

    @property
    def portfolio_id(self) -> int:
        return self._portfolio_id

    @property
    def company_code(self) -> str:
        return self._company_code

    @property
    def price(self) -> float:
        return self._price

    @property
    def volume(self) -> int:
        return self._volume

    @property
    def transaction_time(self) -> datetime:
        return self._transaction_time
