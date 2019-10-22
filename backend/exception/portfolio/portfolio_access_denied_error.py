class PortfolioAccessDeniedError(Exception):
    def __init__(self, user_id, portfolio_id):
        self.message = f'User: {user_id} cannot access portfolio: {portfolio_id}'
