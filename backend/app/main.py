# import model vào main.py
from fastapi import FastAPI
from app.database import engine, Base
from app.routers import auth, packages, transaction, users, features

from app.models.user import User
from app.models.feature import Feature
from app.models.package import Package
from app.models.user_credits import UserCredits
from app.models.transaction import Transaction
from app.models.package_features import PackageFeature

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(packages.router)
app.include_router(transaction.router)
app.include_router(users.router)
app.include_router(features.router)



# @app.get("/")
# def root():
#     return {"message": "The SaaS Credit System API"}