from app.models.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.review import Review


class Like(Base):
    __tablename__ = "likes"

    like_id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False, unique=True
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    review_id: Mapped[int] = mapped_column(
        ForeignKey("reviews.review_id"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="likes")
    review: Mapped["Review"] = relationship(back_populates="likes")

    __table_args__ = (
        UniqueConstraint("user_id", "review_id", name="up_user_review_like"),
    )
