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

router=APIRouter(prefix="/purchase", tags=["Purchase"])

@router.post("/",response_model=TransactionOut, status_code=201)
def create_purchase(payload:TransactionCreate, db:Session=Depends(get_db)):
    if(db.query(Transaction).filter(Transaction.id==payload.id).first()):
        raise HTTPException(404, "Mã giao dịch đã tồn tại!")
    
    user=db.query(User).filter(User.id==payload.user_id).first()

    # Kiểm tra user
    if not user:
        raise HTTPException(404, "User không hợp lệ!")
    

    # Kiểm tra package
    package=db.query(Package).filter(Package.id==payload.package_id).first()

    if not package:
        raise HTTPException(404,"Không tìm thấy gói!")

    # Tạo transaction
    transaction=Transaction(
        id=payload.id,
        user_id=user.id,
        package_id=package.id,
        amount= payload.amount,
        credits_added=package.credits_added,

        status="success",       
    )
    db.add(transaction)

    # Cộng credits vào tài khoản user
    user_credits=db.query(UserCredits).filter(UserCredits.user_id==user.id).first()

    if not user_credits:
        user_credits=UserCredits(id=str(uuid.uuid4()),user_id=user.id,balance=0)
        db.add(user_credits)

    user_credits.balance+=package.credits

    db.commit()
    db.refresh(transaction)
    return transaction