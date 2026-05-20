
from pydantic import BaseModel
from datetime import datetime
from app.schemas.package_schema import PackageOut
from app.schemas.user_schema import UserOut

class TransactionCreate(BaseModel):
    id:str
    user_id:str
    package_id:str
    amount:int
  

class TransactionOut(BaseModel):
    id: str
    amount: float
    credits_added: int
    user: UserOut
    package: PackageOut

    status: str
    created_at: datetime

    class Config:
        orm_mode = True