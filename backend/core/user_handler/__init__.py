from fastapi import HTTPException


from v1.models import User
from core.user_handler.security_utils import security
from core.logger import console_logger

class UserHandler:
    def register_new_user(self, email: str, password: str):
        existing = User.objects(email=email).first()

        if existing:
            raise HTTPException(status_code=400, detail="User already exists")
        try:
            new_user = User(email=email, password=security.hash_password(password))
            new_user.save()
            return new_user
        except Exception as e:
            console_logger.error(f"Error registering user: {e}") 
            raise HTTPException(status_code=500, detail="Internal Server Error during registration")

    def authenticate_user(self, email: str, password: str) -> str:
        try:
            user = User.objects(email=email).first()

            if not user or not security.verify_password(password, user.password):
                raise HTTPException(status_code=401, detail="Invalid credentials")

            return security.create_token({"sub": str(user.id)})
        except HTTPException:
            raise
        except Exception as e:
            console_logger.error(f"Error authenticating user: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error during authentication")


user_handler = UserHandler()
