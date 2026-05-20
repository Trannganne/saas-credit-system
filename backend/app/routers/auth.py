from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.user_schema import UserOut, UserCreate, Token, LoginRequest
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from sqlalchemy.orm import Session
from app.database import get_db
import uuid

router=APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: UserCreate, db:Session=Depends(get_db)):
    if db.query(User).filter(User.email==payload.email).first():
        raise HTTPException(400, detail="Username đã tồn tại!")
    user=User(id=str(uuid.uuid4()),full_name=payload.full_name, email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(payload:LoginRequest, db:Session=Depends(get_db)):
    user=db.query(User).filter(User.email==payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Email hoặc mật khẩu không đúng")
    token=create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
