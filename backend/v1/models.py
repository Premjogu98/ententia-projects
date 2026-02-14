import datetime
from mongoengine import (
    Document,
    StringField,
    ListField,
    DateTimeField,
    ReferenceField,
    DictField,
    CASCADE,
)


class User(Document):
    meta = {"collection": "users"}

    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(default="user")
    created_at = DateTimeField(default=datetime.datetime.utcnow)


class Insight(Document):
    meta = {
        "collection": "insights",
        "indexes": [
            "created_by",
            "category",
            "status",
            "complexity",
            "tags",
            "$title",  # Text index for search
            "$content", # Text index for search
            
            # Pagination & Sorting Optimization
            "-created_at",
            ("category", "-created_at"),
            ("status", "-created_at"),
            ("complexity", "-created_at"),
            ("created_by", "-created_at")
        ]
    }

    title = StringField(required=True)
    content = StringField(required=True)
    tags = ListField(StringField())
    
    # New Fields
    category = StringField(default="General")
    status = StringField(default="Draft") # Draft, Published, Archived
    complexity = StringField(default="Medium") # Low, Medium, High
    metadata = DictField(default={}) # Flexible key-value store

    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)
    created_by = ReferenceField(User, reverse_delete_rule=CASCADE)
