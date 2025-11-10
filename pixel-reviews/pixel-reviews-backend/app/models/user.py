from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from .base import Base
from typing import TYPE_CHECKING

# Models
if TYPE_CHECKING:
    from app.models.review import Review
    from app.models.rating import Rating


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    email: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    username: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(30), nullable=False)
    lastname: Mapped[str] = mapped_column(String(30), nullable=False)
    age: Mapped[datetime] = mapped_column(nullable=False)
    bio: Mapped[str] = mapped_column(String(300), nullable=True)
    location: Mapped[str] = mapped_column(String(40), nullable=True)
    website: Mapped[str] = mapped_column(String(40), nullable=True)
    avatar_url: Mapped[str] = mapped_column(nullable=True)
    avatar_public_id: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # Relationships
    reviews: Mapped[list["Review"]] = relationship(
        back_populates="author",
        cascade="all, delete-orphan",
        uselist=True,
        lazy="dynamic",
    )
    ratings: Mapped[list["Rating"]] = relationship(
        back_populates="author", cascade="all, delete-orphan", lazy="dynamic"
    )

    @property
    def average_rating(self):
        if not self.ratings.count():
            return 0.0
        return sum(rating.score for rating in self.ratings) / self.ratings.count()

    @property
    def total_ratings(self):
        return self.ratings.count()

    @property
    def total_reviews(self):
        return self.reviews.count()

    def __str__(self):
        return self.username
