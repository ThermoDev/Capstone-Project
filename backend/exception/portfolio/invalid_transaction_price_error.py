class InvalidTransactionPriceError(Exception):
    def __init__(self, symbol, price):
        self.message = f'Transaction invalid - market value of stock: {symbol} is not {price}'