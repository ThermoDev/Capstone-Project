from models.portfolio import Portfolio
from models.stock_holding import StockHolding
from models.stock_holding import StockTransaction
from models.user import User
from datetime import datetime

def main():
    p1 = Portfolio(1, 'janesmith', 'p1', 10000.00, [])
    t1 = StockTransaction(1, 1, "AAPL", 234.40, 2, datetime.now())
    t2 = StockTransaction(2, 1, "NFLX", 218.56, 10, datetime.now())
    t3 = StockTransaction(3, 1, "AAPL", 209.29, 1, datetime.now())

    p1.process_transaction(t1)
    #print(p1.stock_holdings)
    p1.process_transaction(t2)
    #print(p1.stock_holdings)
    p1.process_transaction(t3)
   #print(p1.stock_holdings)


    print("holdings: " + str(p1.stock_holdings))
    print("cash: " + str(p1.cash))
    print("value: " + str(p1.portfolio_value))
    print("return: " + str(p1.portfolio_return))

    t4 = StockTransaction(4, 1, "NFLX", 279.12, -5, datetime.now())
    p1.process_transaction(t4)
    print("holdings: " + str(p1.stock_holdings))
    print("cash: " + str(p1.cash))
    print("value: " + str(p1.portfolio_value))
    print("return: " + str(p1.portfolio_return))

    # t5 = StockTransaction(4, 1, "NDAQ", 19.80, -2, datetime.now())
    # p1.process_transaction(t5)
    #
    # t6 = StockTransaction(5, 1, "AAPL", 230.58, -10, datetime.now())
    # p1.process_transaction(t6)
    #
    # t7 = StockTransaction(4, 1, "AAPL", 223.90, 1000000, datetime.now())
    # p1.process_transaction(t7)

main()



