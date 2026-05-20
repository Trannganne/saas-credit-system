from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.feature import Feature
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.feature_check import check_feature_access

router=APIRouter(prefix="/tools", tags=["Features"])

@router.post("/{feature_name}")
def use_feature(
    feature_name:str,
    current_user: User=Depends(get_current_user),
    db:Session=Depends(get_db)):

    check_feature_access( feature_name, current_user, db)

    feature=db.query(Feature).filter(Feature.name==feature_name).first()

    return{
        "feature":feature_name,
        "message":f"Bạn có quyền dùng {feature.description}",
        "user":current_user.email,
        "status":"granted"}

