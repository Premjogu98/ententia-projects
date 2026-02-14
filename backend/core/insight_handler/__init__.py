from typing import List, Optional, Dict, Any
from fastapi import HTTPException
from faker import Faker
import random
import mongoengine
from mongoengine.queryset.visitor import Q

from v1.models import Insight, User
from v1.serializers import InsightCreate, InsightUpdate
from core.user_handler import UserHandler
from core.utils import Utils
from core.logger import console_logger

fake = Faker()


class InsightHandler:
    
    def bulk_insert_insights(self, count: int = 5000) -> str:
        # Retrieve a user to assign insights to (admin or first available)
        user = User.objects(email="admin@ententia.ai").first()
        if not user:
            user = User.objects.first()
        
        if not user:
            # If absolutely no user exists, create a temp one
            handler = UserHandler()
            user = handler.register_new_user(f"seed_{random.randint(1000,9999)}@ententia.ai", "password")

        insights = []
        categories = ["Generative AI", "Process Automation", "Governance", "Operations", "Finance"]
        statuses = ["Draft", "Published", "Archived", "Planned"]
        complexities = ["Low", "Medium", "High"]

        # Batch insert optimization could be better with raw pymongo if needed, 
        # but MongoEngine insert is fine for 5000.
        for _ in range(count):
            insights.append(
                Insight(
                    title=fake.sentence(nb_words=6),
                    content=fake.paragraph(nb_sentences=5),
                    tags=random.sample(Utils.TAGS_POOL, k=random.randint(1, 3)),
                    category=random.choice(categories),
                    status=random.choice(statuses),
                    complexity=random.choice(complexities),
                    metadata={"generated": True, "batch": "bulk_seed"},
                    created_by=user
                )
            )
        
        if insights:
            Insight.objects.insert(insights)

        return f"{count} insights inserted successfully"

    def create_new_insight(self, payload: InsightCreate, user: User) -> Insight:
        insight = Insight(
            title=payload.title,
            content=payload.content,
            tags=payload.tags,
            category=payload.category,
            status=payload.status,
            complexity=payload.complexity,
            metadata=payload.metadata,
            created_by=user
        )
        insight.save()
        console_logger.debug(f"Created insight: {insight.id}")
        return insight

    def fetch_insight_by_id(self, insight_id: str, user: User) -> Insight:
        # Allow access to any insight
        insight = Insight.objects(id=insight_id).first()
        if not insight:
            raise HTTPException(status_code=404, detail="Not found")
        return insight

    def modify_insight_details(self, insight_id: str, payload: InsightUpdate, user: User) -> Insight:
        # Allow any user to modify any insight
        insight = Insight.objects(id=insight_id).first()

        if not insight:
            raise HTTPException(status_code=404, detail="Not found")

        if payload.title is not None:
            insight.title = payload.title
        if payload.content is not None:
            insight.content = payload.content
        if payload.tags is not None:
            insight.tags = payload.tags
        if payload.category is not None:
            insight.category = payload.category
        if payload.status is not None:
            insight.status = payload.status
        if payload.complexity is not None:
            insight.complexity = payload.complexity
        if payload.metadata is not None:
            insight.metadata = payload.metadata

        insight.save()
        return insight

    def remove_insight_record(self, insight_id: str, user: User) -> None:
        # Allow any user to delete any insight
        insight = Insight.objects(id=insight_id).first()

        if not insight:
            raise HTTPException(status_code=404, detail="Not found")

        insight.delete()

    def fetch_all_insights(
        self,
        user: User,
        search: Optional[str] = None,
        tag: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
        complexity: Optional[str] = None,
        sort: str = "created_at",
        order: str = "desc",
        page: int = 1,
        size: int = 10,
    ) -> Dict[str, Any]:
        
        if user.role == "super_admin":
            query = Insight.objects()
        else:
            # Allow all users to see all insights per request
            query = Insight.objects()

        # Search
        if search:
            query = query.filter(Q(title__icontains=search) | Q(content__icontains=search))

        # Filters
        if tag:
            query = query.filter(tags=tag)
        if category:
            query = query.filter(category=category)
        if status:
            query = query.filter(status=status)
        if complexity:
            query = query.filter(complexity=complexity)

        # Sorting
        sort_field = f"-{sort}" if order == "desc" else f"+{sort}"
        query = query.order_by(sort_field)

        # Pagination Calculation
        total_count = query.count()
        total_pages = (total_count + size - 1) // size

        # Fetch Data
        offset = (page - 1) * size
        insights = query.skip(offset).limit(size)
        
        results = []
        for doc in insights.as_pymongo():
            doc["id"] = str(doc["_id"])
            doc["_id"] = str(doc["_id"])
            del doc["_id"]
            results.append(doc)

        return {
            "items": results,
            "total": total_count,
            "page": page,
            "size": size,
            "pages": total_pages
        }


insight_handler = InsightHandler()
