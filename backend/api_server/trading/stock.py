class Stock:
    '''
    A class used to represent a stock in a company

    ...
    Attributes
    ----------
    marketSymbol: `str`
        The stock exchange market symbol e.g. ASX or NASDAQ
    stockSymbol: `str`
        The stock symbol e.g. QAN
    name: `str`
        The stock name e.g. Qantas Airways Limited
    '''
    def __init__(self, marketSymbol, stockSymbol, name):
        self.marketSymbol = marketSymbol
        self.stockSymbol = stockSymbol
        self.name = name

    def __hash__(self):
        return hash((self.marketSymbol, self.stockSymbol, self.name))

    def __eq__(self, other):
        return (self.marketSymbol, self.stockSymbol, self.name) == (other.marketSymbol, other.stockSymbol, other.name)

    def __ne__(self, other):
        return not (self == other)

#TODO: For pricing history will need to hit DB/Data Sanitiser for data retrieved from APIs
