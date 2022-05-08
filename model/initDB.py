from sql import connect


conn = connect()
cursor = conn.cursor()

# Drop (IF)Existing Tables
cursor.execute('DROP TABLE IF EXISTS users, url, expired')

# Create Tables
cursor.execute('CREATE TABLE users('
               'id SERIAL,'
               'email VARCHAR(320) UNIQUE NOT NULL,'
               'PRIMARY KEY (id))'
               )

cursor.execute('CREATE TABLE url('
               'uid INTEGER NOT NULL,'
               'short_code CHAR(6) PRIMARY KEY,'
               'long_url VARCHAR(2000) NOT NULL,'
               'expiration CHAR(19) NOT NULL,'
               'FOREIGN KEY (uid) REFERENCES users(id))'
               )

cursor.execute('CREATE TABLE expired('
               'short_code CHAR(6) PRIMARY KEY,'
               'long_url VARCHAR(2000) NOT NULL)'
               )

conn.commit()

cursor.close()
conn.close()
