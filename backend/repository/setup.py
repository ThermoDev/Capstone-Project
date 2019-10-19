import sqlite3


def init_db():
    conn = sqlite3.connect('resources/TradiE.db')
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS User (
                    username varchar(50) PRIMARY KEY not null,
                    lastName text, 
                    firstName text,
                    email text,
                    password datetime)
                ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Company (
                    ASXCode varchar(10) PRIMARY KEY not null,
                    name text,
                    industry varchar(80))
                ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Portfolio (
                    portfolioID integer PRIMARY KEY autoincrement,
                    holder varchar(50) references User(username),
                    cash float)
                ''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Transactions (
                    transactionID integer PRIMARY KEY autoincrement,
                    portfolioID integer references Portfolio(portfolioID),
                    companyCode varchar(10),
                    price float,
                    volume integer,
                    transacTime datetime)
                ''')


    # for testing wll be deleted later
    #cursor.execute("INSERT INTO User VALUES ('bobcarl', 'carl', 'bob', 'bobcarl@gmail.com', 'qwert')")
    #cursor.execute("INSERT INTO User VALUES ('kellyshen', 'shen', 'kelly', 'kellyshen@gmail.com', 'vbghnjm')")
    #cursor.execute("INSERT INTO Company VALUES ('APPL', 'Apple', 'Technology')")
    #cursor.execute("INSERT INTO Portfolio VALUES (null, 'bobcarl', 1000000.00)")
    #cursor.execute("INSERT INTO Transactions VALUES (null, 1, 'APPL', 23.45, 100, current_timestamp)")
    cursor.execute("Select * from User")
    print(cursor.fetchall())
    cursor.execute("Select * from Portfolio")
    print(cursor.fetchall())
    cursor.execute("Select * from Transactions")
    print(cursor.fetchall())
    cursor.execute("Select * from Company")
    print(cursor.fetchall())

    conn.commit()
    conn.close()
