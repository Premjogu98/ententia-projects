from pydantic import BaseModel, EmailStr, Field
from pydantic.generics import GenericModel
from typing import List, Optional, Dict, Any, Generic, TypeVar
from datetime import datetime
from bson import ObjectId

T = TypeVar("T")


class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


class GenericResponse(GenericModel, Generic[T]):
    detail: T


class PaginatedResponse(GenericModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int


class InsightCreate(BaseModel):
    title: str
    content: str
    tags: Optional[List[str]] = []
    category: Optional[str] = "General"
    status: Optional[str] = "Draft"
    complexity: Optional[str] = "Medium"
    metadata: Optional[Dict[str, Any]] = {}


class InsightUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]
    tags: Optional[List[str]]
    category: Optional[str]
    status: Optional[str]
    complexity: Optional[str]
    metadata: Optional[Dict[str, Any]]


class InsightResponse(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    content: str
    tags: Optional[List[str]]
    category: str
    status: str
    complexity: str
    metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    role: str
    created_at: datetime
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        orm_mode = True
