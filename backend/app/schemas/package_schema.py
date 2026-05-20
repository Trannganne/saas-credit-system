from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PackageCreate(BaseModel):
    name: str
    description: str
    price: float
    credits: int

class PackageUpdate(BaseModel):
    name: Optional[str]=None
    description: Optional[str]=None
    price: Optional[float]=None
    credits: Optional[int]=None

class PackageOut(BaseModel):
    id: str
    name: str
    description: str
    price: float
    credits: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

