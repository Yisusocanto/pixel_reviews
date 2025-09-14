from .base import Base
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin



class Review(Base, SerializerMixin):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, nullable=False)
    game_id = Column(Integer, ForeignKey("games.game_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(50), nullable=False)
    content = Column(String(250), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime,  default=datetime.utcnow, onupdate=datetime.utcnow)

    #Realationships
    game = relationship("Game", back_populates="reviews")
    author = relationship("User", back_populates="reviews")