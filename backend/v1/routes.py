from fastapi import APIRouter, Depends, Query, status
from typing import List, Optional

from v1.models import User
from v1.serializers import (
    InsightCreate, 
    InsightResponse, 
    UserCreate, 
    InsightUpdate, 
    TokenResponse,
    GenericResponse,
    PaginatedResponse,
    UserResponse,
)
from core.user_handler.dependencies import auth_dependency
from core.user_handler import user_handler
from core.insight_handler import insight_handler
from core.utils.db_connection import * 

router = APIRouter()


@router.on_event("startup")
def on_startup():
    User.ensure_indexes()
    from v1.models import Insight
    Insight.ensure_indexes()


@router.get("", tags=["HealthCheck"])
def endpoint_for_healthcheck_service():
    return {"detail": "success"}


@router.post("/seed", tags=["Dev Api's"], response_model=GenericResponse[str])
def bulk_seed_insights(
    count: int = 5000,
):
    result = insight_handler.bulk_insert_insights(count)
    return {"detail": result}


@router.post("/", response_model=GenericResponse[InsightResponse], status_code=status.HTTP_201_CREATED, response_model_by_alias=False)
def add_new_insight(
    payload: InsightCreate,
    current_user: User = Depends(auth_dependency.get_current_user),
):
    insight = insight_handler.create_new_insight(payload, current_user)
    return {"detail": insight}


@router.get("/{insight_id}", response_model=GenericResponse[InsightResponse], response_model_by_alias=False)
def fetch_insight_by_id(
    insight_id: str,
    current_user: User = Depends(auth_dependency.get_current_user),
):
    insight = insight_handler.fetch_insight_by_id(insight_id, current_user)
    return {"detail": insight}


@router.put("/{insight_id}", response_model=GenericResponse[InsightResponse], response_model_by_alias=False)
def modify_insight_details(
    insight_id: str,
    payload: InsightUpdate,
    current_user: User = Depends(auth_dependency.get_current_user),
):
    insight = insight_handler.modify_insight_details(insight_id, payload, current_user)
    return {"detail": insight}


@router.delete("/{insight_id}", status_code=status.HTTP_200_OK)
def remove_insight_record(
    insight_id: str,
    current_user: User = Depends(auth_dependency.get_current_user),
):
    insight_handler.remove_insight_record(insight_id, current_user)
    return {"detail": "Insight deleted successfully"}


@router.get("/", response_model=GenericResponse[PaginatedResponse[InsightResponse]], response_model_by_alias=False)
def list_all_insights(
    search: Optional[str] = None,
    tag: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    complexity: Optional[str] = None,
    sort: str = "created_at",
    order: str = "desc",
    page: int = 1,
    size: int = Query(10, le=1000), # Increased limit to 1000 as requested
    current_user: User = Depends(auth_dependency.get_current_user),
):
    insights_data = insight_handler.fetch_all_insights(
        user=current_user,
        search=search,
        tag=tag,
        category=category,
        status=status,
        complexity=complexity,
        sort=sort,
        order=order,
        page=page,
        size=size
    )
    return {"detail": insights_data}


@router.post("/register", response_model=GenericResponse[str])
def register_user_account(payload: UserCreate):
    user_handler.register_new_user(payload.email, payload.password)
    return {"detail": "User created"}


@router.post("/login", response_model=GenericResponse[TokenResponse])
def login_user_session(payload: UserCreate):
    token = user_handler.authenticate_user(payload.email, payload.password)
    return {"detail": {"access_token": token, "token_type": "bearer"}}


@router.get("/users/me", response_model=GenericResponse[UserResponse], response_model_by_alias=False)
def get_current_user_details(current_user: User = Depends(auth_dependency.get_current_user)):
    return {"detail": current_user}
