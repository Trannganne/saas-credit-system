from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.user_credits import UserCredits
from app.models.transaction import Transaction
from app.schemas.userCredit_schema import UserCreditOut
from app.schemas.transaction_schema import TransactionOut
from typing import List
from app.dependencies.auth import get_current_user


router=APIRouter(prefix="/users/me", tags=["Users"])

@router.get("/credits", response_model=UserCreditOut)
def get_my_credits(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    user_credits=db.query(UserCredits).filter(UserCredits.user_id==current_user.id).first()

    if not user_credits:
        raise HTTPException(status_code=404,detail="Chưa có credits nào! ")
    return user_credits

# Lịch sử mua credits
@router.get("/transactions", response_model=List[TransactionOut])
def get_my_transactions(current_user:User=Depends(get_current_user), db:Session=Depends(get_db)):
    return db.query(Transaction).filter(Transaction.user_id==current_user.id).all()




