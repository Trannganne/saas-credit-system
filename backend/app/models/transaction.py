from datetime import datetime

from app.database import Base
from sqlalchemy import Column, DateTime, Integer, ForeignKey, String
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    package_id = Column(String, ForeignKey("packages.id"))
    amount = Column(Integer)
    credits_added = Column(Integer)

    user=relationship("User", back_populates="transactions")
    package=relationship("Package", back_populates="transactions")

    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

