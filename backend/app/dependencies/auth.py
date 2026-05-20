from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.security import decode_access_token

# chỉ định endpoint login để lấy token
oauth2_scheme=OAuth2PasswordBearer(tokenUrl="auth/logoin")

def get_current_user(token:str=Depends(oauth2_scheme), db:Session=Depends(get_db))->User:
    # Giải mã token
    payload=decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token không hợp lệ hoặc đã hết hạn!")
    
    # Lấy email từ payload ( lúc tạo token đã set sub bằng email)

    email=payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token  không chứa thông tin user")
    
    # Tìm user trong db

    user=db.query(User).filter(User.email==email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User không tồn tại")
    
    return user
    

