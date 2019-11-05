class GameEndedTransactionError(Exception):
    def __init__(self, name: str):
        self.message = f'Game: {name} has ended - cannot process transactions.'