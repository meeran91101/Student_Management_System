from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import bcrypt
import jwt
import datetime
from pydantic import BaseModel
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext


app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class StudentSchema(BaseModel):
    name: str
    age: int
    course: str
    location: str
    pincode: str
    phone_number: str


# Database connection
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:meeran6991@localhost:3306/student_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ Models for Students & Users
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    course = Column(String(100), nullable=False)
    location = Column(String(150), nullable=False)
    pincode = Column(String(10), nullable=False)
    phone_number = Column(String(15), nullable=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    userName = Column(String(100), unique=True, index=True, nullable=False)
    mobileNumber = Column(String(15))
    password = Column(String(255), nullable=False)

Base.metadata.create_all(bind=engine)




# Pydantic models
class LoginModel(BaseModel):
    userName: str
    password: str

class SignupModel(BaseModel):
    userName1: str
    mobileNumber: str
    password: str
    conformPassword: str

class ForgotModel(BaseModel):
    userName: str
    password: str
    conformPassword: str


@app.post("/login")
def login(user: LoginModel):
    db = SessionLocal()
    db_user = db.query(User).filter(User.userName == user.userName).first()
    if db_user and pwd_context.verify(user.password, db_user.password):
        return {"message": "Login Successful", "status": "200"}
    raise HTTPException(status_code=401, detail="Invalid username or password")


@app.post("/signup")
def signup(data: SignupModel):
    if data.password != data.conformPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    db = SessionLocal()
    existing_user = db.query(User).filter(User.userName == data.userName1).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_pw = pwd_context.hash(data.password)
    new_user = User(userName=data.userName1, mobileNumber=data.mobileNumber, password=hashed_pw)
    db.add(new_user)
    db.commit()
    return {"message": "Signup successful"}


@app.post("/forgot-password")
def forgot_password(data: ForgotModel):
    if data.password != data.conformPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    db = SessionLocal()
    db_user = db.query(User).filter(User.userName == data.userName).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.password = pwd_context.hash(data.password)
    db.commit()
    return {"message": "Password updated successfully"}


## 🔹 Student Management
@app.get("/students")
def get_students(db: Session = Depends(get_db), skip: int = Query(0), limit: int = Query(10)):
    return db.query(Student).offset(skip).limit(limit).all()

@app.get("/students/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if student:
        return student
    raise HTTPException(status_code=404, detail="Student not found")

@app.post("/students")
def add_student(student: StudentSchema, db: Session = Depends(get_db)):
    new_student = Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return {"message": "Student added successfully!", "student": new_student}

@app.put("/students/{student_id}")
def update_student(student_id: int, updated_student: StudentSchema, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if student:
        for key, value in updated_student.dict().items():
            setattr(student, key, value)
        db.commit()
        db.refresh(student)
        return {"message": "Student updated successfully!", "student": student}
    raise HTTPException(status_code=404, detail="Student not found")

@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if student:
        db.delete(student)
        db.commit()
        return {"message": "Student deleted successfully!"}
    raise HTTPException(status_code=404, detail="Student not found")
