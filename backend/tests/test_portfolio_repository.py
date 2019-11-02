import sqlite3
import unittest

from models.portfolio import Portfolio
from repository.portfolio_repository import PortfolioRepository
from werkzeug.security import generate_password_hash


class TestPortfolioRepository(PortfolioRepository):
    def __init__(self):
        super().__init__()
        self._db_path = 'temp/db'

class PortfolioRepositoryTests(unittest.TestCase):
    portfolio_repository = TestPortfolioRepository()

    def test_get_all_portfolios_for_user(self):

        portfolio = self.portfolio_repository.get_all_portfolios_for_user('test')
        

    def test_get_portfolio_by_id(self):
        portfolio = self.portfolio_repository.get_portfolio_by_id(1)

        self.assertEqual(portfolio.portfolio_id, 1)
        self.assertEqual(portfolio.holder, 'test')
        self.assertEqual(portfolio.name, 'myFirstPort')
        self.assertEqual(portfolio.cash, 10000.00)

    def test_build_stock_transactions_for_user(self):
        pass

    def test_has_portfolio_by_user_and_name(self):

        portfolio = self.portfolio_repository.has_portfolio_by_user_and_name('test', 'myFirstPort')

        self.assertEqual(portfolio, True)

    def test_add_portfolio(self):

        portfolio = Portfolio(None, 'test', 'myThirdPort', 15000.00, [])

        portfolio = self.portfolio_repository.add_portfolio(portfolio)
        portfolio = self.portfolio_repository.get_portfolio_by_id(portfolio.portfolio_id)

        self.assertEqual(portfolio.portfolio_id, 3)
        self.assertEqual(portfolio.holder, 'test')
        self.assertEqual(portfolio.name, 'myThirdPort')
        self.assertEqual(portfolio.cash, 15000.00)

    def test_update_portfolio(self):

        portfolio = Portfolio(1, 'test', 'myFirstPort', 200000.00, [])
        portfolio = self.portfolio_repository.update_portfolio(portfolio)

        self.assertEqual(portfolio.portfolio_id, 1)
        self.assertEqual(portfolio.holder, 'test')
        self.assertEqual(portfolio.name, 'myFirstPort')
        self.assertEqual(portfolio.cash, 200000.00)


if __name__ == '__main__':
    with sqlite3.connect('temp/db') as connection:
        cursor = connection.cursor()
        cursor.execute('''DROP TABLE IF EXISTS Users''')
        cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
                                username varchar(50) PRIMARY KEY not null,
                                firstName text, 
                                lastName text,
                                email text,
                                password varchar(200))
                            ''')
        cursor.execute('''INSERT INTO Users VALUES (?, ?, ?, ?, ?)''',
                       ('test', 'Martin', 'Le', 'minh.le023@gmail.com', generate_password_hash('test', method='sha256')))
        cursor.execute('''DROP TABLE IF EXISTS Portfolios''')
        cursor.execute('''CREATE TABLE Portfolios (
                            portfolioID integer PRIMARY KEY autoincrement,
                            holder varchar(50) references User(username),
                            name text,
                            cash float)
                        ''')
        cursor.execute('''INSERT INTO Portfolios VALUES (?, ?, ?, ?)''', (None, 'test', 'myFirstPort', 10000.00))
        cursor.execute('''INSERT INTO Portfolios VALUES (?, ?, ?, ?)''', (None, 'test', 'mySecondPort', 20000.00))
        connection.commit()

    unittest.main()
