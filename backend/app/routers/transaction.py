from fastapi import APIRouter, FastAPI, HTTPException, Depends
from app.models.package import Package
from app.schemas.transaction_schema import TransactionOut, TransactionCreate
from app.schemas.user_schema import UserOut
from app.models.user import User
from app.models.transaction import Transaction
from app.models.user_credits import UserCredits 
from sqlalchemy.orm import Session
from app.database import get_db
import uuid
from app.dependencies.auth import get_current_user

router=APIRouter(prefix="/purchase", tags=["Purchase"])

@router.post("/",response_model=TransactionOut, status_code=201)
def create_purchase(payload:TransactionCreate, current_user:User=Depends(get_current_user) ,db:Session=Depends(get_db)):
   
    # Kiểm tra package
    package=db.query(Package).filter(Package.id==payload.package_id).first()

    if not package:
        raise HTTPException(404,"Không tìm thấy gói!")

    # Tạo transaction
    transaction=Transaction(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        package_id=package.id,
        amount= package.price,
        credits_added=package.credits,

        status="success",       
    )
    db.add(transaction)

    # Cộng credits vào tài khoản user
    user_credits=db.query(UserCredits).filter(UserCredits.user_id==current_user.id).first()

    if not user_credits:
        user_credits=UserCredits(id=str(uuid.uuid4()),user_id=current_user.id,balance=0)
        db.add(user_credits)

    user_credits.balance+=package.credits

    db.commit()
    db.refresh(transaction)
    return transaction