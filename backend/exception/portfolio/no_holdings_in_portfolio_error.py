class NoHoldingsInPortfolio(Exception):
    def __init__(self, portfolio_id, symbol):
        self.message = f'Portfolio: {portfolio_id} has no holdings for stock: {symbol}'