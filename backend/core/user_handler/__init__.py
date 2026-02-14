from fastapi import HTTPException
from v1.models import User
from core.user_handler.security_utils import security


class UserHandler:
    def register_new_user(self, email: str, password: str):
        existing = User.objects(email=email).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")
        print(existing)
        new_user = User(
            email=email,
            password=security.hash_password(password)
        )
        print(existing)
        new_user.save()

        return new_user

    def authenticate_user(self, email: str, password: str) -> str:
        user = User.objects(email=email).first()

        if not user or not security.verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return security.create_token({"sub": str(user.id)})


user_handler = UserHandler()
