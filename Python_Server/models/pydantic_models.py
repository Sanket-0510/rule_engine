from pydantic import BaseModel, EmailStr
from typing import List, Optional,Dict


class UserProfile(BaseModel):
    id: int  
    name: str
    email: EmailStr


class Rule(BaseModel):
    name: str
    description: Optional[str]
    rule_data: str  


class UserRules(BaseModel):
    name1: str  
    name2: str
    operator: str  
    name: str  
    description: Optional[str]  


class SignupForm(BaseModel):
    name: str
    email: EmailStr
    password: str

class loginForm(BaseModel):
    email: EmailStr
    password: str

class ruleEvaluate(BaseModel):
    name: str
    condition: dict

class merge_Rule(BaseModel):
    name1: str
    name2: str
    operator: str
    description: str
