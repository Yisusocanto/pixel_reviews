from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm.relationships import Relationship
from datetime import datetime
from .base import Base


class User(Base):
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
    reviews = Relationship("Review", back_populates="author", cascade="all, delete-orphan", lazy="dynamic")
    ratings = Relationship("Rating", back_populates="user", cascade="all, delete-orphan", lazy="dynamic")

    def __str__(self):
        return self.username


