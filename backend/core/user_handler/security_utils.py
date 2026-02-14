from datetime import datetime, timedelta
from jose import jwt
from typing import Any
import base64


from config import config


class SecurityManager:

    def hash_password(self, password: str):
        encoded_bytes = base64.b64encode(password.encode("utf-8"))
        encoded_string = encoded_bytes.decode("utf-8")
        return encoded_string

    def verify_password(self, plain: str, hashed: str):
        decoded_bytes = base64.b64decode(hashed.encode("utf-8"))
        decoded_string = decoded_bytes.decode("utf-8")
        return plain == decoded_string

    def create_token(self, data: dict[str, Any]):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(
            minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)

    def decode_token(self, token: str):
        return jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])


security = SecurityManager()
