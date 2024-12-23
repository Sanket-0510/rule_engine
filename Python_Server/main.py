from fastapi import FastAPI, Depends
from controllers.authController import login, signup
from controllers.rules import createRule, mergeRule, evaluateData
# from controllers.user import get_user_profiles
from models.pydantic_models import SignupForm, loginForm, Rule, ruleEvaluate, merge_Rule
from middlewaares.auth import get_current_user
import asyncpg
from conn import get_db

app = FastAPI()

# Authentication Routes
@app.post("/login")
async def login_route(login_form: loginForm, conn: asyncpg.Connection = Depends(get_db)):
    return await login(login_form, conn)

@app.post("/signup")
async def signup_route(signup_form: SignupForm, conn: asyncpg.Connection = Depends(get_db)):
    return await signup(signup_form, conn)

# Rules Routes
@app.post("/rules/create")
async def create_rule_route(rule: Rule, current_user: dict = Depends(get_current_user),conn: asyncpg.Connection = Depends(get_db)):
    return await createRule(rule, current_user,conn)

@app.post("/rules/evaluate")
async def evaluate_rule_route(rule_evaluate: ruleEvaluate, current_user: dict = Depends(get_current_user),conn: asyncpg.Connection = Depends(get_db)):
    return await evaluateData(rule_evaluate, current_user, conn)

@app.post("/rules/merge")
async def merge_rule_route(data: merge_Rule, current_user: dict = Depends(get_current_user),conn: asyncpg.Connection = Depends(get_db)):
    return await mergeRule(data, current_user, conn)

# User Routes
# @app.get("/users/profiles")
# async def get_user_profiles_route(current_user: dict = Depends(get_current_user)):
#     return await get_user_profiles(current_user)

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
