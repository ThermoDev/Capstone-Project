import sqlite3




database = sqlite3.connect('TradiE.db')
db = database.cursor()

#create table - USERS

def createdb() :
    if db.fetch()[0] != 1:

        db.execute('''CREATE TABLE USERS (
            [generated_id] INTEGER PRIMARY KEY, 
            [lastName] TEXT, [firstName] TEXT, 
            [userName] TEXT, [email] TEXT, 
            [passwordHash] TEXT)''')


        database.commit()

