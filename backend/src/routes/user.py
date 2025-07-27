from fastapi import APIRouter, HTTPException, Body, Depends
from src.models.chat import User, UserCreate
from src.db import SessionLocal
from src.db.chat_models import User as UserDB
from src.auth.auth_utils import create_access_token, get_current_user
from passlib.context import CryptContext

router = APIRouter(prefix="/api/user", tags=["User"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/login")
def login(user: UserCreate):
    db = SessionLocal()
    db_user = db.query(UserDB).filter_by(email=user.email).first()
    db.close()
    if (
        not db_user
        or not db_user.password_hash
        or not verify_password(user.password, db_user.password_hash)
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(db_user.user_id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/create")
def create_user(user: UserCreate):
    db = SessionLocal()
    if user.email:
        existing = db.query(UserDB).filter_by(email=user.email).first()
        if existing:
            db.close()
            raise HTTPException(status_code=400, detail="Email already registered")
    db_user = UserDB(
        name=user.name,
        email=user.email,
        location=user.location,
        preferred_language=user.preferred_language,
        crops_grown=user.crops_grown,
        user_type=user.user_type,
        years_experience=user.years_experience,
        main_goal=user.main_goal,
        password_hash=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.close()
    return User(
        user_id=db_user.user_id,
        name=db_user.name,
        email=db_user.email,
        location=db_user.location,
        preferred_language=db_user.preferred_language,
        crops_grown=db_user.crops_grown,
        user_type=db_user.user_type,
        years_experience=db_user.years_experience,
        main_goal=db_user.main_goal,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at,
    )


@router.get("/{user_id}")
def get_user(user_id: str, current_user=Depends(get_current_user)):
    db = SessionLocal()
    db_user = db.query(UserDB).filter_by(user_id=user_id).first()
    db.close()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(
        user_id=db_user.user_id,
        name=db_user.name,
        email=db_user.email,
        location=db_user.location,
        preferred_language=db_user.preferred_language,
        crops_grown=db_user.crops_grown,
        user_type=db_user.user_type,
        years_experience=db_user.years_experience,
        main_goal=db_user.main_goal,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at,
    )


@router.patch("/{user_id}")
def update_user(
    user_id: str, user: User = Body(...), current_user=Depends(get_current_user)
):
    db = SessionLocal()
    db_user = db.query(UserDB).filter_by(user_id=user_id).first()
    if not db_user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in user.dict(exclude_unset=True).items():
        setattr(db_user, field, value)
    db.commit()
    db.refresh(db_user)
    db.close()
    return User(
        user_id=db_user.user_id,
        name=db_user.name,
        email=db_user.email,
        location=db_user.location,
        preferred_language=db_user.preferred_language,
        crops_grown=db_user.crops_grown,
        user_type=db_user.user_type,
        years_experience=db_user.years_experience,
        main_goal=db_user.main_goal,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at,
    )


@router.delete("/{user_id}")
def delete_user(user_id: str, current_user=Depends(get_current_user)):
    db = SessionLocal()
    db_user = db.query(UserDB).filter_by(user_id=user_id).first()
    if not db_user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    db.close()
    return {"detail": "User deleted successfully"}
