from fastapi import Depends, HTTPException, status
from app.models.user import User
from app.models.transaction import Transaction
from app.models.feature import Feature
from app.models.package_features import PackageFeature
from app.database import get_db
from app.dependencies.auth import get_current_user
from sqlalchemy.orm import Session

def check_feature_access(feature_name:str,
                    current_user:User=Depends(get_current_user),
                    db:Session=Depends(get_db)):
    """Dùng như dependencies trong router"""
    transactions=db.query(Transaction).filter(
            Transaction.user_id==current_user.id, 
            Transaction.status=="success").all()
        
    if not transactions:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn chưa mua gói nào!")
        
    package_ids=[t.package_id for t in transactions]

        # Tìm feature theo tên
    feature=db.query(Feature).filter(Feature.name==feature_name).first()

    if not feature:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Tính năng {feature_name} không tồn tại!")
        
        # Kiểm tra feature có thuộc package mà user đã mua không
    has_access=db.query(PackageFeature).filter(
            PackageFeature.package_id.in_(package_ids),
            PackageFeature.feature_id==feature.id).first()
        
    if not has_access:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Gói của bạn không có quyền dùng tình năng {feature_name}")
        
    return current_user # Trả về user nếu có quyền
    
