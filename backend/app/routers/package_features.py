from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.package_features import PackageFeature
from app.models.package import Package
from app.models.feature import Feature
from app.schemas.feature_schema import FeatureOut
import uuid

router=APIRouter(prefix="/packages", tags=["Package Features"])

# Xem features của 1 package
@router.get("/{package_id}/features",response_model=List[FeatureOut])
def get_package_features(package_id:str, db:Session=Depends(get_db)):
    package=db.query(Package).filter(Package.id==package_id).first()

    if not package:
        raise HTTPException(404,"Không tìm thấy package")
    
    pfs=db.query(PackageFeature).filter(PackageFeature.package_id==package_id).all()

    feature_ids=[pf.feature_id for pf in pfs]

    return db.query(Feature).filter(Feature.id.in_(feature_ids)).all()

# Gán feature vào package
@router.post("/{package_id}/features/{feature_id}", status_code=201)
def add_feature_to_package(package_id:str, feature_id:str, db:Session=Depends(get_db)):
    package=db.query(Package).filter(Package.id==package_id).first()
    feature=db.query(Feature).filter(Feature.id==feature_id).first()
    
    if not package:
        raise HTTPException(404, "Không tìm thấy package!")
    if not feature:
        raise HTTPException(404, "Không tìm thấy feature này!")
    
    # Kiểm tra đã gán chưa
    exists=db.query(PackageFeature).filter(
        PackageFeature.package_id==package_id,
        PackageFeature.feature_id==feature_id,
    ).first()

    if exists:
        raise HTTPException(400, "Feature này đã được gán vào package!")
    
    pf=PackageFeature(
        id=str(uuid.uuid4()),
        package_id=package_id,
        feature_id=feature_id
    )

    db.add(pf)
    db.commit()
    db.refresh(pf)

@router.delete("/{package_id}/features/{feature_id}",status_code=204)
def remove_feature_from_package(package_id:str,feature_id:str, db:Session=Depends(get_db)):
    pf=db.query(PackageFeature).filter(
        PackageFeature.package_id==package_id,
        PackageFeature.feature_id==feature_id
    ).first()

    if not pf:
        raise HTTPException(404, "Không tìm thấy sự kết hợp của package và feature này!")
    
    db.delete(pf)
    db.commit()
    
