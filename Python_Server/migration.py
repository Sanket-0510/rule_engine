import psycopg2
from psycopg2.extras import RealDictCursor

DB_HOST = "localhost"
DB_NAME = "zeotap_db"
DB_USER = "postgres"
DB_PASSWORD = "zeotap"

def run_migration(file_path):
    conn = psycopg2.connect(
    host= DB_HOST,
    database= DB_NAME,
    user = DB_USER,
    password = DB_PASSWORD,
    cursor_factory= RealDictCursor
    )

    cursor = conn.cursor()

    with open(file_path, 'r') as f:
        sql = f.read()

    try:
        cursor.execute(sql)
        conn.commit()
        print("table made")
    except Exception as e:
        print(f"could not apply migration due to {e}")
    finally:
        cursor.close()
        conn.close()

run_migration("./migrations/initialise_database.sql")



