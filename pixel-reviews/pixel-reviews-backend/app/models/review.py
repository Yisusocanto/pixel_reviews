from .base import Base
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm.relationships import Relationship
from datetime import datetime


class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, nullable=False)
    game_id = Column(Integer, ForeignKey("games.game_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(50), nullable=False)
    content = Column(String(250), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime,  default=datetime.utcnow, onupdate=datetime.utcnow)

    #Realationships
    game = Relationship("Game", back_populates="reviews")
    author = Relationship("User", back_populates="reviews")