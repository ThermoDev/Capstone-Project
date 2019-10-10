import sqlite3
from backend.models.user import User

# connecting to the database
conn = sqlite3.connect('TradiE.db')
c = conn.cursor()

# creating tables for the database
def init_tables(conn, c):

    c.execute("DROP TABLE IF EXISTS Users")

    c.execute('''CREATE TABLE Users (
                userID integer PRIMARY KEY autoincrement,
                lastName text, 
                firstName text,
                email text,
                passwordHash text)
            ''')

    c.execute("DROP TABLE IF EXISTS Company")

    c.execute('''CREATE TABLE Company (
                companyCode varchar(10) PRIMARY KEY,
                companyName text,
                industry varchar(80),
                price float)
            ''')

    c.execute("DROP TABLE IF EXISTS Portfolios")

    c.execute('''CREATE TABLE Portfolios (
                portfolioID integer PRIMARY KEY autoincrement, 
                value float,
                return float)
            ''')

    c.execute("DROP TABLE IF EXISTS ContainsStocks")

    c.execute('''CREATE TABLE ContainsStocks (
                portfolioID integer references Portfolios(portfolioID),
                stock varchar(10) references Company(companyCode),
                volume integer, 
                targetAllocation float,
                primary key (portfolioID, stock) )     
            ''')

    c.execute("DROP TABLE IF EXISTS Invests")

    c.execute('''CREATE TABLE Invests (
                userID integer references Users(userID),
                portfolioID integer references Portfolios(portfolioID),
                primary key (userID, portfolioID))
            ''')

    conn.commit()

def setup_db():

    init_tables(conn, c)

    # for testing wll be deleted later
    c.execute("INSERT INTO Users VALUES (null, 'smith', 'jane', 'janesmith@gmail.com', 'qwert')")
    c.execute("INSERT INTO Users VALUES (null, 'chen', 'kris', 'krischen@gmail.com', 'vbghnjm')")

    c.execute("INSERT INTO Company VALUES ('APPL', 'Apple', 'Technology', 143.54)")
    c.execute("INSERT INTO Portfolios VALUES (null, '34600.32', '23.5')")
    c.execute("INSERT INTO ContainsStocks VALUES(1, 'APPL', 100, 3.0)")
    c.execute("INSERT INTO Invests VALUES('1', '1')")
    #c.execute("Select * from ContainsStocks")
    #c.execute("Select * from Invests")
    #print(c.fetchall())
    conn.commit()


#printing out all users
def print_users(c):
    output = c.execute("SELECT * FROM Users ORDER BY userID")
    for record in output:
        print('User ID: ' + str(record[0]))
        print('First Name: ' + str(record[2]))
        print('Last Name: ' + str(record[1]))
        print('Email: ' + str(record[3]))


def print_companies(c):
    output = c.execute("SELECT * FROM Company ORDER BY companyCode")
    for record in output:
        print('Company Code: ' + str(record[0]))
        print('Company Name: ' + str(record[1]))
        print('Industry: ' + str(record[2]))
        print('Last traded stock price: ' + str(record[3]))

def print_portfolios(c):
    output = c.execute("SELECT * FROM Portfolios ORDER BY portfolioID")
    for record in output:
        print('Portfolio ID: ' + str(record[0]))
        print('Current Value: ' + str(record[1]))
        print('Portfolio Returns: ' + str(record[2]))

# printing out users by their first, last or full name
def print_users_by_name(c, firstName=None, lastName=None):
    if firstName != None and lastName == None:
        output = c.execute("Select * from USERS where firstName=firstName")
        output = output.fetchall()
        if output == []:
            print("No users found")
        else:
            for record in output:
                print('User ID: ' + str(record[0]))
                print('First Name: ' + str(record[2]))
                print('Last Name: ' + str(record[1]))
                print('Email: ' + str(record[3]))
    elif firstName == None and lastName != None:
        output = c.execute("Select * from USERS where firstName=firstName and lastName=lastName")
        output = output.fetchall()
        if output == []:
            print("No users found")
        else:
            for record in output:
                print('User ID: ' + str(record[0]))
                print('First Name: ' + str(record[2]))
                print('Last Name: ' + str(record[1]))
                print('Email: ' + str(record[3]))
    elif firstName != None and lastName != None:
        output = c.execute("Select * from USERS where firstName=firstName and lastName=lastName")
        output = output.fetchall()
        if output == []:
            print("No users found")
        else:
            for record in output:
                print('User ID: ' + str(record[0]))
                print('First Name: ' + str(record[2]))
                print('Last Name: ' + str(record[1]))
                print('Email: ' + str(record[3]))

#check to see if a user exists by their email
def users_by_email(c, email):
    output = c.execute("Select * from USERS where email=email")
    output = output.fetchall()
    if output == []:
        print("The user does not exist")
    else:
        for record in output:
            print("The user is: " + str(record[0]) + " " + str(record[2]) + " " + str(record[1]))


setup_db()

#print_companies(c)
#print_portfolios(c)
#print_users(c)
#bug: printing out everything
#print_users_by_name(c, 'smith')
#print_users_by_name(c, 'jane')
#print_users_by_name(c, 'bob', 'lee')
#users_by_email(c, 'asfsf')
#users_by_email(c, 'janesmith@gmail.com')


conn.close()


