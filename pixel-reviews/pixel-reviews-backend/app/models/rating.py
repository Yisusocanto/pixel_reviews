from .base import Base
from sqlalchemy import (
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from typing import Optional, TYPE_CHECKING

# Models
if TYPE_CHECKING:
    from app.models.game import Game
    from app.models.user import User
    from app.models.review import Review


class Rating(Base):

    __tablename__ = "ratings"

    rating_id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.game_id"), nullable=False)
    score: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    game: Mapped["Game"] = relationship(back_populates="ratings")
    author: Mapped["User"] = relationship(back_populates="ratings")
    review: Mapped[Optional["Review"]] = relationship(back_populates="rating")

    # Restrictions
    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_user_game_rating"),
        CheckConstraint("score >= 1 AND score <= 5", name="cc_score_range"),
    )
