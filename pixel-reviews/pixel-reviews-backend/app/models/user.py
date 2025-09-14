from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base
from sqlalchemy_serializer import SerializerMixin


class User(Base, SerializerMixin):
    __tablename__ = "users"

    user_id = Column(Integer(), primary_key=True, autoincrement=True, nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(200), nullable=False)
    name = Column(String(50), nullable=False)
    lastname = Column(String(50), nullable=False)
    age = Column(DateTime(), nullable=False)
    created_at = Column(DateTime(), default=datetime.now())

    #Relationships
    reviews = relationship("Review", back_populates="author", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="user", cascade="all, delete-orphan")

    def __str__(self):
        return self.username


