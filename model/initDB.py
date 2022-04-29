from sql import connect


conn = connect()
cursor = conn.cursor()

# Drop (IF)Existing Tables
cursor.execute('DROP TABLE IF EXISTS url, expired')

# Create Tables
cursor.execute('CREATE TABLE url('
               'short_code CHAR(6) PRIMARY KEY,'
               'long_url VARCHAR(2000) NOT NULL,'
               'creation CHAR(14) NOT NULL)')

cursor.execute('CREATE TABLE expired('
               'short_code CHAR(6) PRIMARY KEY,'
               'long_url VARCHAR(2000) NOT NULL,'
               'expired_on CHAR(14) NOT NULL)')

conn.commit()

cursor.close()
conn.close()
