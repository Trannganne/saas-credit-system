from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.package_schema import PackageOut, PackageCreate,PackageUpdate
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.package import Package

router=APIRouter(prefix="/packages",tags=["Packages"])
import uuid

# Lấy tất cả packages
@router.get("/",response_model=List[PackageOut])
def get_packages(db:Session=Depends(get_db)):
    return db.query(Package).all()


@router.post("/",response_model=PackageOut, status_code=201)
def create_package(payload: PackageCreate, db:Session=Depends(get_db)):
    package=Package(id=str(uuid.uuid4()),**payload.model_dump())
    db.add(package)
    db.commit()
    db.refresh(package)
    return package

@router.put("/{id}",response_model=PackageOut)
def update_package(id:str, payload:PackageUpdate, db:Session=Depends(get_db)):
    package=db.query(Package).filter(Package.id==id).first()
    if not package:
        raise HTTPException(404, "Không tìm thấy package! Vui lòng kiểm tra lại!")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(package, field, value)
    db.commit()
    db.refresh(package)
    return package

@router.delete("/{id}",status_code=204)
def delete_package(id:str,db:Session=Depends(get_db)):
    package=db.query(Package).filter(Package.id==id).first()
    if not package:
        raise HTTPException(404,"Không tìm thấy package cần xóa!")
    db.delete(package)
    db.commit()
    return {"message":"Xóa thành công!"}


