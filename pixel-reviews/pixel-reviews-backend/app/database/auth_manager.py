from app.database.base import DatabaseBase
from app.models import User, PasswordResetToken
from app.utils import password_handler
from datetime import datetime
from typing import Optional


class AuthManager(DatabaseBase):
    """Manages authentication operations"""

    @classmethod
    def get_hashed_password(cls, username: str) -> Optional[str]:
        """Get user's hashed password"""
        with cls.get_session() as session:
            hashed_password = (
                session.query(User.password).filter(User.username == username).first()
            )
            return hashed_password[0] if hashed_password else None

    @classmethod
    def update_password(cls, user_id: int, new_password: str) -> Optional[dict]:
        """Update user password (Only in password reset operations)"""
        try:
            with cls.get_session() as session:
                user = session.query(User).filter(User.user_id == user_id).first()
                if not user:
                    return None

                user.password = new_password
                return {"success": "Password updated successfully"}

        except Exception as e:
            print("Error updating password:", e)
            return None

    @classmethod
    def change_password(
        cls, user_id: int, current_password: str, new_password: str
    ) -> Optional[User]:
        """Change the user's old password to a new one"""
        try:
            with cls.get_session() as session:
                user = session.query(User).filter(User.user_id == user_id).first()
                if not user:
                    return None

                # It is verified that the password entered by the user matches the one stored in the database
                if not password_handler.check_password(current_password, user.password):
                    return None

                user.password = new_password
                return user

        except Exception as e:
            print("error on change_password", e)
            return None

    @classmethod
    def create_password_reset_token(
        cls, user_id: int, reset_token: str
    ) -> Optional[str]:
        """Create a password reset token"""
        try:
            with cls.get_session() as session:
                token = PasswordResetToken(user_id=user_id, token=reset_token)
                session.add(token)
                session.flush()
                return token.token

        except Exception as e:
            print("Error creating reset token:", e)
            return None

    @classmethod
    def check_reset_token(cls, reset_token: str) -> Optional[int]:
        """Verify and consume reset token"""
        try:
            with cls.get_session() as session:
                token = (
                    session.query(PasswordResetToken)
                    .filter(
                        PasswordResetToken.token == reset_token,
                        PasswordResetToken.expires_at > datetime.now(),
                    )
                    .first()
                )

                if not token:
                    return None

                token.token = None
                token.expires_at = None
                return token.user_id

        except Exception as e:
            print("Error checking reset token:", e)
            return None
