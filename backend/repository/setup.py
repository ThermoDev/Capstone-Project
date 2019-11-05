import sqlite3


def init_db():
    conn = sqlite3.connect('resources/TradiE.db')
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
                    username varchar(50) PRIMARY KEY not null,
                    firstName text,
                    lastName text, 
                    email text,
                    password varchar(200))
                ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Companies (
                    ASXCode varchar(10) PRIMARY KEY not null,
                    name text,
                    industry varchar(80))
                ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Portfolios (
                    portfolioID integer PRIMARY KEY autoincrement,
                    holder varchar(50) references Users(username),
                    name text,
                    cash float)
                ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Transactions (
                    transactionID integer PRIMARY KEY autoincrement,
                    portfolioID integer references Portfolios(portfolioID),
                    companyCode varchar(10),
                    price float,
                    volume integer,
                    transactionTime datetime)
                ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Games (
                    gameID integer PRIMARY KEY autoincrement,
                    name text,
                    startDate datetime,
                    endDate datetime)
                ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS GameMemberships(
                    gameID integer references Games(gameID),
                    username varchar(50) references Users(username),
                    PRIMARY KEY (gameID, username))
                ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS GamePortfolios(
                    gameID integer references Games(gameID),
                    portfolioID integer references Portfolios(portfolioID),
                    PRIMARY KEY (gameID, portfolioID))
                ''')

    # for testing wll be deleted later
    #cursor.execute("INSERT INTO Users VALUES ('bobcarl', 'carl', 'bob', 'bobcarl@gmail.com', 'qwert')")
    #cursor.execute("INSERT INTO Users VALUES ('kellyshen', 'shen', 'kelly', 'kellyshen@gmail.com', 'vbghnjm')")
    #cursor.execute("INSERT INTO Companies VALUES ('APPL', 'Apple', 'Technology')")
    #cursor.execute("INSERT INTO Portfolios VALUES (null, 'bobcarl', 1000000.00)")
    #cursor.execute("INSERT INTO Transactions VALUES (null, 1, 'APPL', 23.45, 100, current_timestamp)")
    # cursor.execute("Select * from Users")
    # print(cursor.fetchall())
    # cursor.execute("Select * from Portfolios")
    # print(cursor.fetchall())
    # cursor.execute("Select * from Transactions")
    # print(cursor.fetchall())
    # cursor.execute("Select * from Companies")
    # print(cursor.fetchall())

    conn.commit()
    conn.close()
