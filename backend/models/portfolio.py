from typing import List, Optional

from exception.portfolio.insufficient_cash_error import InsufficientCashError
from exception.portfolio.exceed_stock_holding_volume_error import ExceedStockHoldingVolumeError
from exception.portfolio.no_holdings_in_portfolio_error import NoHoldingsInPortfolio
from models.stock_holding import StockHolding
from models.stock_transaction import StockTransaction
import data_pipeline.stockhelper


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

    @property
    def stock_holdings(self) -> {}:
        return self._stock_holdings

    @property
    def portfolio_value(self) -> float:
        return self.calculate_portfolio_value()

    @property
    def portfolio_return(self) -> float:
        return self.calculate_portfolio_return()

    def update_with_generated_id(self, generated_id: int):
        self._portfolio_id = generated_id

    def process_transaction(self, transaction: StockTransaction):
        cash_required = transaction.volume * transaction.price
        if self.cash < cash_required:
            raise InsufficientCashError(self.portfolio_id)

        if transaction.volume < 0 and transaction.company_code not in self._stock_holdings:
            raise NoHoldingsInPortfolio(self.portfolio_id)

        if transaction.volume < 0 and transaction.volume > self._stock_holdings[transaction.company_code]['holding'].volume:
            raise ExceedStockHoldingVolumeError(self.portfolio_id)

        self._cash -= cash_required
        self._stock_transactions.append(transaction)

        self._update_stock_holdings(transaction)

    def _build_stock_holdings(self):
        for transaction in self._stock_transactions:
            self._update_stock_holdings(transaction)

    def _update_stock_holdings(self, transaction):
        stock = self._stock_holdings.get(transaction.company_code)

        # if it is a new stock; new StockHolding object needs to be created
        if stock is None:
            new_stock = StockHolding(transaction.company_code)
            new_stock.add_transaction(transaction)
            self._stock_holdings[transaction.company_code] = {"holding" : new_stock, "weight": 0, "value" : 0}
            stock_value = self.calculate_stock_value(transaction.company_code)
            self._stock_holdings[transaction.company_code] = {"holding" : new_stock, "weight": 0, "value" : stock_value}

        # if the stock already exists in the portfolio; update stock information
        else:
            stock["holding"].add_transaction(transaction)
            new_stock_value = self.calculate_stock_value(transaction.company_code)
            self._stock_holdings[transaction.company_code]["value"] = new_stock_value

        # readjust weightings for all stock holdings
        for stock in self._stock_holdings:
            new_stock_weighting = self.calculate_stock_weightings(stock)
            self._stock_holdings[stock]["weight"] = new_stock_weighting


    # sum of value of all stocks in the portfolio
    def calculate_portfolio_value(self) -> float:
        value = 0
        for code in self._stock_holdings:
            value = value + self.calculate_stock_value(code)
        return value

    # the sum of returns of all stocks in the portfolio according to their weighting
    def calculate_portfolio_return(self) -> float:
        portfolio_return = 0
        for stock in self._stock_holdings:
            portfolio_return = portfolio_return + \
                            (self.calculate_stock_return(stock)
                            * self.calculate_stock_weightings(stock))
        return portfolio_return


    def calculate_stock_weightings(self, company_code) -> float:

        # total volume of all stocks in the portfolio
        total_volume = 0
        for code in self._stock_holdings:
            stock = self._stock_holdings[code]['holding']
            total_volume = total_volume + stock.volume

        # volume of specific stock in the portfolio
        if company_code in self._stock_holdings:
            stock_volume = self._stock_holdings[company_code]['holding'].volume
        else:
            stock_volume = 0

        if total_volume == 0:
            return 0
        else:
            return stock_volume/total_volume


    # value of stock holding according to current prices
    def calculate_stock_value(self, company_code) -> float:
        if company_code in self._stock_holdings:
            stock_value = self._stock_holdings[company_code]['holding'].volume \
                        * data_pipeline.stockhelper.get_cur_close_price(company_code)
            return stock_value
        else:
            return 0


    def calculate_stock_return(self, company_code) -> float:

        # value of stock holding according to the prices they were bought at and sold at
        initial_value = 0
        for transaction in self._stock_transactions:
            if transaction.company_code == company_code:
                initial_value = initial_value + (transaction.price * transaction.volume)

        # value of stock holding according to the current prices
        current_value = self.calculate_stock_value(company_code)

        stock_return = (current_value-initial_value)/initial_value

        return stock_return





