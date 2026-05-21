from pydantic import BaseModel

class FeatureOut(BaseModel):
    id: str
    name: str
    description: str
    cost:int

    class Config:
        from_attributes = True