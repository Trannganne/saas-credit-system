from app.database import Base
from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship

class PackageFeature(Base):
    __tablename__ = "package_features"

    id = Column(String, primary_key=True, index=True)
    package_id = Column(String, ForeignKey("packages.id"), nullable=False)
    feature_id = Column(String, ForeignKey("features.id"), nullable=False)

    feature=relationship("Feature", back_populates="package_features")
    package=relationship("Package", back_populates="package_features")