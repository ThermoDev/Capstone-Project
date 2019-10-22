class PortfolioNotFoundError(Exception):
    def __init__(self, portfolio_id):
        self.message = f'No portfolio found with id: {portfolio_id}'
