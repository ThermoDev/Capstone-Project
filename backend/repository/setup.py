import sqlite3


def init_db():
    conn = sqlite3.connect('resources/TradiE.db')
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
                    userID integer PRIMARY KEY autoincrement,
                    lastName text, 
                    firstName text,
                    email text,
                    passwordHash text)
                    ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Company (
                    companyCode varchar(10) PRIMARY KEY,
                    companyName text,
                    industry varchar(80),
                    price float)
                    ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Portfolios (
                    portfolioID integer PRIMARY KEY autoincrement, 
                    value float,
                    return float)
                    ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS ContainsStocks (
                    portfolioID integer references Portfolios(portfolioID),
                    stock varchar(10) references Company(companyCode),
                    volume integer, 
                    targetAllocation float,
                    primary key (portfolioID, stock) )     
                    ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Invests (
                userID integer references Users(userID),
                portfolioID integer references Portfolios(portfolioID),
                primary key (userID, portfolioID))
                ''')

    # for testing wll be deleted later
    '''c.execute("INSERT INTO Users VALUES (null, 'smith', 'jane', 'janesmith@gmail.com', 'qwert')")
    c.execute("INSERT INTO Users VALUES (null, 'chen', 'kris', 'krischen@gmail.com', 'vbghnjm')")

    c.execute("INSERT INTO Company VALUES ('APPL', 'Apple', 'Technology', 143.54)")
    c.execute("INSERT INTO Portfolios VALUES (null, '34600.32', '23.5')")
    c.execute("INSERT INTO ContainsStocks VALUES(1, 'APPL', 100, 3.0)")
    c.execute("INSERT INTO Invests VALUES('1', '1')")
    #c.execute("Select * from ContainsStocks")
    #c.execute("Select * from Invests")
    #print(c.fetchall())'''

    conn.commit()
    conn.close()
