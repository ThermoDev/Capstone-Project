class ExceedStockHoldingVolumeError(Exception):
    def __init__(self, portfolio_id):
        self.message = f'Transaction volume exceeds the stock holding volume in portfolio: {portfolio_id}'