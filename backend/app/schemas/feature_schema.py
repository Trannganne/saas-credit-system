from pydantic import BaseModel

class FeatureOut(BaseModel):
    id: str
    name: str
    description: str

    class Config:
        from_attributes = True