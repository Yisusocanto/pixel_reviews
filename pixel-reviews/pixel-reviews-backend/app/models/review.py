from .base import Base
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from typing import TYPE_CHECKING

# Models
if TYPE_CHECKING:
    from app.models.game import Game
    from app.models.user import User
    from app.models.rating import Rating
    from app.models.like import Like


class Review(Base):
    __tablename__ = "reviews"

    review_id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.game_id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    rating_id: Mapped[int] = mapped_column(
        ForeignKey("ratings.rating_id"), nullable=False, unique=True
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(String(3000), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    game: Mapped["Game"] = relationship(back_populates="reviews")
    author: Mapped["User"] = relationship(back_populates="reviews")
    rating: Mapped["Rating"] = relationship(back_populates="review")
    likes: Mapped[list["Like"]] = relationship(
        back_populates="review", cascade="all, delete-orphan", lazy="dynamic"
    )

    # Properties
    @property
    def total_likes(self):
        return self.likes.count()
