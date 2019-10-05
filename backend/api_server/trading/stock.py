class Stock:
    """
    A class used to represent a stock in a company

    ...
    Attributes
    ----------
    market_symbol: `str`
        The stock exchange market symbol e.g. ASX or NASDAQ
    stock_symbol: `str`
        The stock symbol e.g. QAN
    name: `str`
        The stock name e.g. Qantas Airways Limited
    """

    def __init__(self, market_symbol, stock_symbol, name):
        self.market_symbol = market_symbol
        self.stock_symbol = stock_symbol
        self.name = name

    def __hash__(self):
        return hash((self.market_symbol, self.stock_symbol, self.name))

    def __eq__(self, other):
        self_tuple = (self.market_symbol, self.stock_symbol, self.name)
        other_tuple = (other.market_symbol, other.stock_symbol, other.name)

        return self_tuple == other_tuple

    def __ne__(self, other):
        return not (self == other)

# TODO: For pricing history will need to hit DB/Data Sanitiser for data retrieved from APIs
