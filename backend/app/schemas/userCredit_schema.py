from pydantic import BaseModel
from app.schemas.user_schema import UserOut
from datetime import datetime

class UserCreditOut(BaseModel):
    id: str
    balance: int
    user: UserOut
    created_at: datetime

    class Config:
        from_attributes = True