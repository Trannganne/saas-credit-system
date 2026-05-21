
from pydantic import BaseModel
from datetime import datetime
from app.schemas.package_schema import PackageOut
from app.schemas.user_schema import UserOut

class TransactionCreate(BaseModel):
    package_id:str
  

class TransactionOut(BaseModel):
    id: str
    amount: float
    credits_added: int
    user: UserOut
    package: PackageOut

    status: str
    created_at: datetime

    # user:Optional[UserOut]=None
    # package:Optinal[PackageOut]=None

    class Config:
        from_attributes = True