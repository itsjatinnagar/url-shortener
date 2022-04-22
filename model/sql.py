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
