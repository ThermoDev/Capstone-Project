from .stock import Stock

class StockTransaction:
    '''
    A class used to represent the buying or selling of a stock in a portfolio.

    ...
    Attributes
    ----------
    stock: `Stock`
        The stock associated with the transaction
    volume: `int`
        The volume of the stock bought or sold - can be negative but must be non-zero
    price: `int`
        The price at which the stock was bought or sold
    '''

    def __init__(self, stock, volume, price):
        self.stock = stock
        self.volume = volume
        self.price = price