from sql import connect


conn = connect()
cursor = conn.cursor()

# Drop (IF)Existing Tables
cursor.execute('DROP TABLE IF EXISTS users, url, expired')

# Create Tables
cursor.execute('CREATE TABLE users('
               'id SERIAL,'
               'email VARCHAR(320) UNIQUE NOT NULL,'
               'PRIMARY KEY (id)'
               ')')

cursor.execute('CREATE TABLE url('
               'uid INTEGER NOT NULL,'
               'short_code CHAR(6) PRIMARY KEY,'
               'long_url VARCHAR(2000) NOT NULL,'
               'created_on CHAR(19) NOT NULL,'
               'expired BOOLEAN NOT NULL DEFAULT false,'
               'click INTEGER NOT NULL DEFAULT 0,'
               'FOREIGN KEY (uid) REFERENCES users(id)'
               ')')

cursor.execute('CREATE TABLE expired('
               'uid INTEGER NOT NULL,'
               'long_url VARCHAR(2000) NOT NULL,'
               'short_code CHAR(6) NOT NULL,'
               'click INTEGER NOT NULL,'
               'FOREIGN KEY (uid) REFERENCES users(id)'
               ')')

conn.commit()

cursor.close()
conn.close()
