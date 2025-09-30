from sqlalchemy import String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import date
from .base import Base
from .developer import developers_association
from .publisher import publishers_association
from sqlalchemy_serializer import SerializerMixin
from typing import Optional, TYPE_CHECKING

# Models
if TYPE_CHECKING:
    from app.models.review import Review
    from app.models.rating import Rating
    from app.models.developer import Developer
    from app.models.publisher import Publisher


class Game(Base, SerializerMixin):
    __tablename__ = "games"

    game_id: Mapped[int] = mapped_column(primary_key=True)
    rawg_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(nullable=False, index=True)
    release_date: Mapped[Optional[date]] = mapped_column(nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(nullable=False)

    # Relationships
    reviews: Mapped[list["Review"]] = relationship(
        back_populates="game", lazy="dynamic", cascade="all, delete-orphan"
    )
    ratings: Mapped[list["Rating"]] = relationship(
        back_populates="game", cascade="all, delete-orphan", lazy="dynamic"
    )
    developers: Mapped[list["Developer"]] = relationship(
        secondary=developers_association, back_populates="games", lazy="dynamic"
    )
    publishers: Mapped[list["Publisher"]] = relationship(
        secondary=publishers_association, back_populates="games", lazy="dynamic"
    )

    @property
    def average_rating(self):
        if not self.ratings.count():
            return 0.0
        return sum(rating.score for rating in self.ratings) / self.ratings.count()

    def __str__(self):
        return self.title
