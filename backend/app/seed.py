from app.database import SessionLocal
from app.models.feature import Feature

FEATURES=[
    {"id": "f1", "name": "create_image",  "description": "Tạo hình ảnh tự động"},
    {"id": "f2", "name": "auto_post",     "description": "Đăng bài tự động"},
    {"id": "f3", "name": "export_pdf",    "description": "Xuất file PDF"},
    {"id": "f4", "name": "send_email",    "description": "Gửi email tự động"},
]

def seed_features():
    db=SessionLocal()
    for f in FEATURES:
        exists=db.query(Feature).filter(Feature.id==f["id"]).first()

        if not exists:
            db.add(Feature(**f))
    
    db.commit()
    db.close()
    