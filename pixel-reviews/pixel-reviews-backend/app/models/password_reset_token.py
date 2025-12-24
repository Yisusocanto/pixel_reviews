from .base import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from datetime import datetime, timedelta


class PasswordResetToken(Base):
    __tablename__ = "password_reset_token"

    token_id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, nullable=False
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    token: Mapped[str] = mapped_column(nullable=True, unique=True)
    expires_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now() + timedelta(minutes=30), nullable=True
    )
