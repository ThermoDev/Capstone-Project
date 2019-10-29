from data_pipeline import stockhelper
from models.stock_transaction import StockTransaction


class StockHolding:
    def __init__(self, company_code: str):
        self._company_code = company_code
        self._volume = 0
        self._amount_invested = 0

    @property
    def company_code(self):
        return self._company_code

    @property
    def volume(self):
        return self._volume

    @property
    def amount_invested(self):
        return self._amount_invested

    @property
    def market_value(self):
        return self.volume * stockhelper.get_cur_close_price(self.company_code)

    @property
    def return_value(self):
        return self.market_value - self.amount_invested


    def add_transaction(self, transaction: StockTransaction):
        self._volume = self._volume + transaction.volume
        self._amount_invested = self._amount_invested + (transaction.price * transaction.volume)