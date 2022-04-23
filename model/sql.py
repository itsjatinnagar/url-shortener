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


def create(short_code, long_url, datetime):
    conn = connect()
    if conn is None:
        return False

    cursor = conn.cursor()
    query = 'INSERT INTO url VALUES (%s, %s, %s)'
    values = (short_code, long_url, datetime,)
    try:
        cursor.execute(query, values)
        conn.commit()
    except (Exception, psycopg2.Error) as error:
        print(f'Error: {error}')
        conn.close()
        return False

    cursor.close()
    conn.close()
