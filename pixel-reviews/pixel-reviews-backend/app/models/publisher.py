from .base import Base
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin


publishers_association = Table(
    "publishers_association",
    Base.metadata,
    Column("game_id", Integer, ForeignKey("games.game_id"), primary_key=True),
    Column(
        "publisher_id", Integer, ForeignKey("publishers.publisher_id"), primary_key=True
    ),
)


class Publisher(Base, SerializerMixin):

    __tablename__ = "publishers"

    publisher_id = Column(Integer, primary_key=True, nullable=False)
    rawg_id = Column(Integer, nullable=False, unique=True)
    name = Column(String, nullable=False)
    slug = Column(String, nullable=False)

    # relationships
    games = relationship(
        "Game",
        secondary=publishers_association,
        back_populates="publishers",
        lazy="dynamic",
    )
