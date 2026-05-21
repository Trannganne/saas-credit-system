from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.feature import Feature
from app.models.package_features import PackageFeature
from app.models.user_credits import UserCredits
from app.models.transaction import Transaction
from app.schemas.userCredit_schema import UserCreditOut
from app.schemas.transaction_schema import TransactionOut
from app.schemas.feature_schema import FeatureOut
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



@router.get("/features",response_model=List[FeatureOut])
def get_my_features(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):

    # Lấy tất cả features
    all_features=db.query(Feature).all()

    #Lấy các giao dịch của khách hàng
    transactions=db.query(Transaction).filter(Transaction.user_id==current_user.id  , Transaction.status=="success").all()

    # Lấy các id package mà khách hàng đã mua
    package_ids=[t.package_id for t in transactions]
    if not package_ids:
        raise HTTPException(404,"Bạn chưa mua gói credit nào!")

    # Lấy các feature đã unlocked
    unlocked_features=db.query(PackageFeature).filter(PackageFeature.package_id.in_(package_ids)).all()

    unlocked_features_ids=[f.feature_id for f in unlocked_features]

    # Lấy thông tin features
    features=db.query(Feature).filter(Feature.id.in_(unlocked_features_ids)).all()
    

    return features




