from app.database import Base
from sqlalchemy import Column, Integer, String, DateTime, Float 
from datetime import datetime
from sqlalchemy.orm import relationship

class Package(Base):
    __tablename__ = "packages"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    credits = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    transactions=relationship("Transaction",back_populates="package")
    package_features=relationship("PackageFeature", back_populates="package")