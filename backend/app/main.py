from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, packages, transaction, users, features, package_features
from app.seeds.seed import seed_data

# Import models để SQLAlchemy biết
from app.models.user import User
from app.models.feature import Feature
from app.models.package import Package
from app.models.user_credits import UserCredits
from app.models.transaction import Transaction
from app.models.package_features import PackageFeature

app = FastAPI(title="SaaS Credit System")

# ====================== CORS ======================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# =================================================

Base.metadata.create_all(bind=engine)

# Seed dữ liệu features (chỉ chạy 1 lần hoặc kiểm tra tồn tại)
seed_data()

app.include_router(auth.router)
app.include_router(packages.router)
app.include_router(transaction.router)
app.include_router(users.router)
app.include_router(features.router)
app.include_router(package_features.router)


@app.get("/")
def root():
    return {"message": "SaaS Credit System API is running. ",
             "docs": "/docs"}