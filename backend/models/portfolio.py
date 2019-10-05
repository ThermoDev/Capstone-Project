from collections import defaultdict


class Portfolio:
    """
    A class used to represent a stock portfolio

    ...
    Attributes
    ----------
    user_id: `str`
        The user that owns the portfolio
    _cash: `int`
        The available cash in the portfolio
    _cash_transactions: `list` of `int`
        List of cash deposits and withdrawals
    _holdings: `dict` from `Stock`: `int`
        The holdings in the portfolio - maps Stock to the volume acquired
    _stock_transactions: `dict` from `Stock`: `list` of `StockTransaction`
        A history of stock transactions that have taken place for each stock
        Maps stock to the list of its stock transactions
        (Necessary to see how the performance of a single stock has affected the performance of a portfolio
            otherwise we can only determine the overall performance of the portfolio as a whole)
    """
    def __init__(self, user_id):
        self.user_id = user_id
        self._cash = 0
        self._cash_transactions = []
        self._holdings = defaultdict(int)
        self._stock_transactions = defaultdict(list)
        # TODO: Establish DB connection?

    @property
    def value(self):
        value = self._cash
        for stock, volume in self._holdings.items():
            value += volume * self._get_price_for_stock(stock)

        return value

    @property
    def profit(self):
        initial_value = 0
        for cash_transaction in self._cash_transactions:
            initial_value += cash_transaction

        return self.value - initial_value

    def get_profit_of_stock(self, stock):
        current_value = self._holdings[stock] * self._get_price_for_stock(stock)
        net_cash = 0
        for stock_transaction in self._stock_transactions[stock]:
            net_cash += stock_transaction.volume * stock_transaction.price

        return current_value + net_cash

    def deposit_cash(self, amount):
        self._process_cash_transaction(amount)

    def withdraw_cash(self, amount):
        self._process_cash_transaction(-amount)

    def _process_cash_transaction(self, amount):
        self._cash += amount
        self._cash_transactions.append(amount)

    def add_stock_transaction(self, stock_transaction):
        self._holdings[stock_transaction.stock] += stock_transaction.volume
        self._stock_transactions[stock_transaction.stock].append(stock_transaction)

    def _get_price_for_stock(self, stock):
        # TODO: Query DataSanitiser/DB for current stock price
        pass
