from collections import defaultdict

from .stock import Stock
from .stock_transaction import StockTransaction

class Portfolio:
    '''
    A class used to represent a stock portfolio

    ...
    Attributes
    ----------
    userId: `str`
        The user that owns the portfolio
    _cash: `int`
        The available cash in the portfolio
    _cashTransactions: `list` of `int`
        List of cash deposits and withdrawals
    _holdings: `dict` from `Stock`: `int`
        The holdings in the portfolio - maps Stock to the volume acquired
    _stockTransactions: `dict` from `Stock`: `list` of `StockTransaction`
        A history of stock transactions that have taken place for each stock - maps stock to the list of its stock transactions
        (Necessary to see how the performance of a single stock has affected the performance of a portfolio - otherwise we can only determine the overall performance of the portfolio as a whole
    '''
    def __init__(self, userId):
        self.userId = userId
        self._cash = 0
        self._cashTransactions = []
        self._holdings = defaultdict(int)
        self._stockTransactions = defaultdict(list)
        # TODO: Establish DB connection?

    @property
    def value(self):
        value = self.cash
        for stock, volume in self._holdings.items():
            value += volume * self.getPriceForStock(stock)

        return value

    @property
    def profit(self):
        initialValue = 0
        for cashTransaction in self._cashTransactions:
            initialValue += cashTransaction

        return self.value - initialValue

    def getProfitOfStock(self, stock):
        currentValue = self._holdings[stock] * self.getPriceForStock(stock)
        netCash = 0
        for stockTransaction in self._stockTransactions[stock]:
            netCash += stockTransaction.volume * stockTransaction.price

        return currentValue + netCash

    def depositCash(self, amount):
        self._processCashTransaction(amount)

    def withdrawCash(self, amount):
        self._processCashTransaction(-amount)

    def _processCashTransaction(self, amount):
        self._cash += amount
        self._cashTransactions.append(amount)

    def addStockTransaction(self, stockTransaction):
        self._holdings[stockTransaction.stock] += stockTransaction.volume
        self._stockTransactions[stockTransaction.stock].append(stockTransaction)

    def _getPriceForStock(self, stock):
        # TODO: Query DataSanitiser/DB for current stock price
        pass
