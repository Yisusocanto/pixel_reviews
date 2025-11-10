from .base import Base
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import TYPE_CHECKING

# Models
if TYPE_CHECKING:
    from app.models.game import Game

publishers_association = Table(
    "publishers_association",
    Base.metadata,
    Column("game_id", Integer, ForeignKey("games.game_id"), primary_key=True),
    Column(
        "publisher_id", Integer, ForeignKey("publishers.publisher_id"), primary_key=True
    ),
)


class Publisher(Base):

    __tablename__ = "publishers"

    publisher_id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    rawg_id: Mapped[int] = mapped_column(nullable=False, unique=True)
    name: Mapped[str] = mapped_column(nullable=False)
    slug: Mapped[str] = mapped_column(nullable=False)

    # relationships
    games: Mapped[list["Game"]] = relationship(
        secondary=publishers_association,
        back_populates="publishers",
        lazy="dynamic",
    )
