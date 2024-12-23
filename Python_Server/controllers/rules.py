import json
from fastapi import Depends, HTTPException
from utils.CreateAST import AST
from middlewaares.auth import get_current_user
from models.pydantic_models import Rule, UserRules, ruleEvaluate, merge_Rule
from conn import get_db
import asyncpg

tree = AST()

async def createRule(rule: Rule, current_user: dict = Depends(get_current_user), db: asyncpg.Connection = Depends(get_db)):
    try:
        # Your rule creation logic
        print(current_user)
        rule_data = rule.rule_data
        print(rule_data)
        root = tree.create_ast(rule_data, 0, len(rule_data)-1)
        print(root)
        tree_json = tree.transform_tree_into_dict(root)
        print(tree_json)
        # The query to insert the rule
        query = """
            INSERT INTO rules (name, description, rule_json, user_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING rule_id
        """
        async with db.transaction():
            # Use the database connection (`db`) and current user's `id` for the insertion
            rule_id = await db.fetchval(query, rule.name, rule.description, json.dumps(tree_json), current_user['id'])

        # Return success response
        return {"message": "Rule created successfully", "rule_id": rule_id}

    except Exception as e:
        # If any error occurs, return HTTPException with an error message
        raise HTTPException(status_code=500, detail=f"Error creating rule: {str(e)}")


# Async version of evaluateData
async def evaluateData(
    rule_evaluate: ruleEvaluate,
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
):
    try:
        # Access current user ID
        user_id = current_user["id"]
        print(f"Current user ID: {user_id}")
        print(f"rule_evaluate: {rule_evaluate}")
        # Access rule name and condition from the Pydantic model
        rule_name = rule_evaluate.name
        rule_condition = rule_evaluate.condition
        print(f"Evaluating rule: {rule_name} with condition: {rule_condition}")

        # Check if the user exists
        user_query = "SELECT * FROM users WHERE id = $1"
        user_data = await db.fetchrow(user_query, user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if the rule exists for the user
        rule_query = "SELECT * FROM rules WHERE user_id = $1 AND name = $2"
        rule_data = await db.fetchrow(rule_query, user_id, rule_name)
        if not rule_data:
            raise HTTPException(status_code=404, detail="Rule not found")
        
        # Parse rule JSON and rebuild AST
        parsed_json = json.loads(rule_data["rule_json"])
        print("oafe")
        print(parsed_json)
        root = tree.rebuild_ast(parsed_json)
        print(root)

        # Evaluate the condition against the rule
        result = tree.evaluate(root, rule_condition)
        print(f"Evaluation result: {result}")

        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating rule: {str(e)}")


# Async version of mergeRule
async def mergeRule(
    rules: merge_Rule,
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db)
):
    try:
        # Get current user
        user_query = "SELECT * FROM users WHERE email = $1"
        user_data = await db.fetchrow(user_query, current_user["email"])
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        # Fetch the first rule
        rule1_query = "SELECT * FROM rules WHERE user_id = $1 AND name = $2"
        rule1 = await db.fetchrow(rule1_query, current_user["id"], rules.name1)
        if not rule1:
            raise HTTPException(status_code=404, detail=f"Rule '{rules.name1}' not found")

        # Fetch the second rule
        rule2_query = "SELECT * FROM rules WHERE user_id = $1 AND name = $2"
        rule2 = await db.fetchrow(rule2_query, current_user["id"], rules.name2)
        if not rule2:
            raise HTTPException(status_code=404, detail=f"Rule '{rules.name2}' not found")

        # Parse rule JSONs
        rule1_json = json.loads(rule1["rule_json"])
        rule2_json = json.loads(rule2["rule_json"])
        
        rule1_tree = tree.rebuild_ast(rule1_json)
        rule2_tree = tree.rebuild_ast(rule2_json)
        # Merge the rules
        operator = rules.operator.upper()
        if operator not in {"AND", "OR"}:
            raise HTTPException(status_code=400, detail=f"Invalid operator: {operator}")

        merged_rule = tree.merge_rule(rule1_tree, rule2_tree, operator)
        print("merged rule", {merged_rule})
        tree_json = tree.transform_tree_into_dict(merged_rule)
        new_rule_json = json.dumps(tree_json)
        print(new_rule_json)
        # Insert the new merged rule
        new_rule_name = f"{rules.name1}_{rules.name2}_{operator}"
        insert_query = """
            INSERT INTO rules (user_id, name, description, rule_json) 
            VALUES ($1, $2, $3, $4) 
            RETURNING rule_id
        """
        async with db.transaction():
            new_rule_id = await db.fetchval(insert_query, current_user["id"], new_rule_name, rules.description, new_rule_json)

        return {"message": "Rule created successfully", "rule_id": new_rule_id}

    except Exception as e:
        # Add detailed logging for debugging
        print(f"Error merging rules: {e}")
        raise HTTPException(status_code=500, detail=f"Error merging rules: {str(e)}")
