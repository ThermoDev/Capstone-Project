import sqlite3
from backend.models.user import User

# connecting to the database
def connect_db():
    conn = sqlite3.connect('TradiE.db')
    c = conn.cursor()
    objects = []
    objects.append(conn)
    objects.append(c)
    return objects


# creating tables for the database
def init_tables(conn, c):
    c.execute("drop table if exists USERS")

    c.execute('''CREATE TABLE USERS (
                userID INTEGER PRIMARY KEY AUTOINCREMENT,
                lastName TEXT, 
                firstName TEXT,
                userName TEXT, 
                email TEXT,
                passwordHash TEXT)
            ''')
    conn.commit()

def setup_db():
    db = connect_db()
    conn = db[0]
    c = db[1]
    init_tables(conn, c)

    c.execute("INSERT INTO USERS VALUES (null, 'smith', 'jane', 'janesmith', 'janesmith@gmail.com', 'qwert')")
    c.execute("Select * from USERS where lastName='smith'")
    print(c.fetchall())
    conn.commit()

    conn.close()


setup_db()

