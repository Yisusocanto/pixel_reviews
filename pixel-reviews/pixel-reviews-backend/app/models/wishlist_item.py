from .base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.game import Game

class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    wishlist_item_id: Mapped[int] = mapped_column(primary_key=True, unique=True, autoincrement=True, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.game_id"), nullable=False)
    added_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="wishlist")
    game: Mapped["Game"] = relationship(back_populates="wishlist")

    __table_args__ = (UniqueConstraint("user_id", "game_id", name="uq_user_game_wishlist_item"),)

