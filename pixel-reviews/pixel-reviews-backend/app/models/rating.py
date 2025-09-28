from .base import Base
from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin


class Rating(Base, SerializerMixin):

    __tablename__ = "ratings"

    rating_id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.game_id"), nullable=False)
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    game = relationship("Game", back_populates="ratings")
    author = relationship("User", back_populates="ratings")

    # Restrictions
    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_user_game_rating"),
        CheckConstraint("score >= 1 AND score <= 5", name="cc_score_range"),
    )
