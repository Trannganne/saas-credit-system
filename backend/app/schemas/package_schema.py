from pydantic import BaseModel
from datetime import datetime

class PackageCreate(BaseModel):
    id: str
    name: str
    description: str
    price: float
    credits: int

class PackageUpdate(BaseModel):
    name: str
    description: str
    price: float
    credits: int

class PackageOut(BaseModel):
    id: str
    name: str
    description: str
    price: float
    credits: int
    created_at: datetime
    update_at: datetime

    class Config:
        from_attributes = True

