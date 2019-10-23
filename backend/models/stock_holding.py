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
        return self._company_code

    @property
    def amount_invested(self):
        return self._company_code

    def add_transaction(self, transaction: StockTransaction):
        pass
        #TODO: add to volume and amount invested from transaction price and volume
