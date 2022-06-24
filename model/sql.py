import os
import psycopg2


def connect():
    try:
        connection = psycopg2.connect(
            host=os.environ['DB_HOST'],
            database=os.environ['DB_NAME'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASS'])
        return connection
    except (Exception, psycopg2.Error) as error:
        print(f'Error: {error}')


def insertUser(email):
    conn = connect()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = 'INSERT INTO users (email) VALUES (%s)'
    values = (email,)
    try:
        cursor.execute(query, values)
        conn.commit()
    except (Exception, psycopg2.Error) as error:
        print(f'Error: {error}')
        conn.close()
        return False

    cursor.close()
    conn.close()


def insertURL(uid, short_code, long_url, datetime):
    conn = connect()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = 'INSERT INTO url (uid,short_code,long_url,created_on) VALUES (%s, %s, %s, %s)'
    values = (uid, short_code, long_url, datetime,)
    try:
        cursor.execute(query, values)
        conn.commit()
    except (Exception, psycopg2.Error) as error:
        print(f'Error: {error}')
        conn.close()
        return False

    cursor.close()
    conn.close()


def check_code(short_code):
    conn = connect()
    if conn is None:
        return None

    cursor = conn.cursor()
    query = 'SELECT * FROM url where short_code = %s'
    values = (short_code,)
    try:
        cursor.execute(query, values)
    except (Exception, psycopg2.Error) as error:
        print(f'Error: {error}')
        conn.close()
        return False

    queryResult = cursor.fetchall()

    cursor.close()
    conn.close()
    return True if len(queryResult) == 0 else False


def read_user_id(email):
    conn = connect()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = 'SELECT id FROM users WHERE email = %s'
    values = (email,)
    try:
        cursor.execute(query, values)
    except (Exception, psycopg2.Error) as error:
        print(f'Error: {error}')
        conn.close()
        return False

    queryResult = cursor.fetchone()

    cursor.close()
    conn.close()
    return queryResult


def updateClickCount(short_code, clickCount):
    conn = connect()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = 'UPDATE url SET click = %s WHERE short_code = %s'
    values = (clickCount+1, short_code,)
    try:
        cursor.execute(query, values)
        conn.commit()
    except (Exception, psycopg2.Error) as error:
        print(f'Error: {error}')
        conn.close()
        return False

    cursor.close()
    conn.close()
    return True


def read_long_url(short_code):
    conn = connect()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = 'SELECT long_url,click FROM url where short_code = %s'
    values = (short_code,)
    try:
        cursor.execute(query, values)
    except (Exception, psycopg2.Error) as error:
        print(f'Error: {error}')
        conn.close()
        return False

    queryResult = cursor.fetchone()

    cursor.close()
    conn.close()

    return queryResult


def read_all(uid):
    conn = connect()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = 'SELECT long_url,short_code,created_on,click,expired FROM url where uid = %s ORDER BY created_on DESC'
    values = (uid,)
    try:
        cursor.execute(query, values)
    except (Exception, psycopg2.Error) as error:
        print(f'Error: {error}')
        conn.close()
        return False

    queryResult = cursor.fetchall()

    cursor.close()
    conn.close()

    return queryResult
