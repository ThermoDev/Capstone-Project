class InsufficientCashError(Exception):
    def __init__(self, portfolio_id):
        self.message = f'Portfolio: {portfolio_id} has insufficient cash to process transaction'
