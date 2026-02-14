from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


from core.user_handler.security_utils import security
from v1.models import User


class AuthDependency:
    def __init__(self):
        self.security_scheme = HTTPBearer()

    def get_current_user(
        self,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    ):

        if credentials.scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")

        token = credentials.credentials

        try:
            payload = security.decode_token(token)
            user_id = payload.get("sub")
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = User.objects(id=user_id).first()

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user


auth_dependency = AuthDependency()
