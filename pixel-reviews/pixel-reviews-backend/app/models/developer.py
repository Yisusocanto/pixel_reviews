from .base import Base
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm.relationships import Relationship


developers_association = Table(
    "developers_association",
    Base.metadata,
    Column("game_id", Integer, ForeignKey("games.game_id"), primary_key=True),
    Column("developer_id", Integer, ForeignKey("developers.developer_id"), primary_key=True)
)


class Developer(Base):

    __tablename__ = "developers"

    developer_id = Column(Integer, primary_key=True, nullable=False)
    rawg_id = Column(Integer, nullable=False, unique=True)
    name = Column(String, nullable=False)
    slug = Column(String, nullable=False)

    #relationships
    games = Relationship("Game", secondary=developers_association, back_populates="developers", lazy="dynamic")