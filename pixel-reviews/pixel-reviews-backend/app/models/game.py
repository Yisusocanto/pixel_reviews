from sqlalchemy import String, Integer, Float, Column, DateTime, Date, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base
from .developer import developers_association
from .publisher import publishers_association
from sqlalchemy_serializer import SerializerMixin



class Game(Base, SerializerMixin):
    __tablename__ = "games"

    game_id = Column(Integer, primary_key=True) # Nuestro ID interno
    rawg_id = Column(Integer, unique=True, nullable=False) # ID de la API de RAWG
    title = Column(String(200), nullable=False)
    slug = Column(String(200), nullable=False, index=True) # Para URLs amigables, usualmente provisto por RAWG
    release_date = Column(Date, nullable=True)
    image_url = Column(String(255), nullable=True) # URL de la imagen principal del juego 
    description = Column(Text, nullable=False)

    #Relationships
    reviews = relationship("Review", back_populates="game", lazy="dynamic", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="game", cascade="all, delete-orphan", lazy="dynamic")

    developers = relationship("Developer", secondary=developers_association, back_populates="games", lazy="dynamic")
    publishers = relationship("Publisher", secondary=publishers_association, back_populates="games", lazy="dynamic")

    @property
    def average_rating(self):
        if not self.ratings.count():
            return 0.0
        return sum(rating.score for rating in self.ratings) / self.ratings.count()

    def __str__(self):
        return self.title