from .base import Base
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy_serializer import SerializerMixin
from typing import TYPE_CHECKING

# Models
if TYPE_CHECKING:
    from app.models.game import Game

developers_association = Table(
    "developers_association",
    Base.metadata,
    Column("game_id", Integer, ForeignKey("games.game_id"), primary_key=True),
    Column(
        "developer_id", Integer, ForeignKey("developers.developer_id"), primary_key=True
    ),
)


class Developer(Base, SerializerMixin):

    __tablename__ = "developers"

    developer_id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    rawg_id: Mapped[int] = mapped_column(nullable=False, unique=True)
    name: Mapped[str] = mapped_column(nullable=False)
    slug: Mapped[str] = mapped_column(nullable=False)

    # relationships
    games: Mapped[list["Game"]] = relationship(
        secondary=developers_association,
        back_populates="developers",
        lazy="dynamic",
    )
