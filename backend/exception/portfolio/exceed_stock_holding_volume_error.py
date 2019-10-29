class ExceedStockHoldingVolumeError(Exception):
    def __init__(self, portfolio_id, symbol):
        self.message = f'Portfolio: {portfolio_id} has insufficient holdings in stock: {symbol} to execute transaction'
