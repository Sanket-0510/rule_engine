import asyncpg
from fastapi import Depends, FastAPI

app = FastAPI()

DB_HOST = "localhost"
DB_NAME = "zeotap_db"
DB_USER = "postgres"
DB_PASSWORD = "zeotap"

# Async database connection function
async def get_db():
    connection = await asyncpg.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )
    try:
        yield connection
    finally:
        await connection.close()
