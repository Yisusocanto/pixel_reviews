from .base import Base
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, UniqueConstraint, CheckConstraint
from sqlalchemy.orm.relationships import Relationship
from datetime import datetime


class Rating(Base):

    __tablename__ = "ratings"

    rating_id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.game_id"), nullable=False)
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    #Realationships
    game = Relationship("Game", back_populates="ratings")
    user = Relationship("User", back_populates="ratings")

    #Restrictions
    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_user_game_rating"),
        CheckConstraint("score >= 1 AND score <= 5", name="cc_score_range")
    )