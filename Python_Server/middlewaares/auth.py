from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from conn import get_db  # Update this if you are using an async database connection (e.g., asyncpg, aiomysql)
from psycopg2.extras import RealDictCursor
import asyncpg
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"

async def get_current_user(token: str = Depends(oauth2_scheme), conn: asyncpg.Connection = Depends(get_db)):
    print(token)
    """Authenticate the user using the token and raw SQL query."""
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload)
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

        # Query the database for the user asynchronously
        print(user_id)
        query = "SELECT id, name, email FROM users WHERE id = $1"
        user = await conn.fetchrow(query, user_id)  # Use fetchrow for a single row result
        print(user)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        # Return the user data in a dictionary format
        return {
            "id": user['id'],
            "name": user['name'],
            "email": user['email'],
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occurred: {str(e)}"
        )