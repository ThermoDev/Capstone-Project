class NoHoldingsInPortfolio(Exception):
    def __init__(self, portfolio_id):
        self.message = f'Portfolio: {portfolio_id} does not hold this particular stock'