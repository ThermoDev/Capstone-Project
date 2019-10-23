class PortfolioAlreadyExistsError(Exception):
    def __init__(self, user_id, name):
        self.message = f'User: {user_id} already owns portfolio with name: {name}'
