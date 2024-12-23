from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from conn import get_db
from utils.auth import create_access_token, verify_password, hash_password
from models.pydantic_models import SignupForm
from psycopg2 import sql
from models.pydantic_models import loginForm
import asyncpg
import asyncio

# Login Controller
async def login(login_data: loginForm, conn: asyncpg.Connection = Depends(get_db)):
    form_data = login_data

    try:
        query = "SELECT id, email, password FROM users WHERE email = $1"
        
        user = await conn.fetchrow(query, form_data.email)

        if not user or not verify_password(form_data.password, user['password']): 
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized"
            )

        token = create_access_token(data={"sub": str(user['id'])})
        return {"token": token, "token_type": "bearer"}
    
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error logging in: {str(e)}"
        )


# Signup Controller
async def signup(form_data: SignupForm, conn: asyncpg.Connection = Depends(get_db)):
    try:
        hashed_password = hash_password(form_data.password)
        query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id"
        
        # Execute the query with the connection object
        user_id = await conn.fetchval(query, form_data.name, form_data.email, hashed_password)

        return {"message": "User created successfully", "user_id": user_id}
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error creating user: {str(e)}"
        )
