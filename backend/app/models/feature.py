from app.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Feature(Base):
    __tablename__ = "features"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

    package_features=relationship("PackageFeature",back_populates="feature")
