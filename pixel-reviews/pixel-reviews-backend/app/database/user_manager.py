from app.database.base import DatabaseBase
from app.models import User
from app.schemas import UserSchema
from sqlalchemy import exc
from datetime import datetime
from typing import Optional


class UserManager(DatabaseBase):
    """Manages user CRUD operations"""

    @classmethod
    def create_user(
        cls,
        email: str,
        password: str,
        username: str,
        name: str,
        lastname: str,
        age: str,
    ) -> int | dict:
        """Create a new user in the database"""
        try:
            with cls.get_session() as session:
                birth_date = datetime.strptime(age, "%Y-%m-%d")
                user = User(
                    email=email,
                    password=password,
                    username=username,
                    name=name,
                    lastname=lastname,
                    age=birth_date,
                )
                session.add(user)
                session.flush()  # To get the user_id before the commit
                user_id = user.user_id
                return user_id

        except exc.IntegrityError as i:
            error_msg = str(i.orig)
            if "email" in error_msg:
                return {"error": "The email is already registered."}
            elif "username" in error_msg:
                return {"error": "The username is already registered."}
            else:
                print("Integrity Error:", i)
                return {"error": "Database integrity error."}

        except Exception as e:
            print("Error on create user:", e)
            return {"error": "An unknown error occurred while creating the user."}

    @classmethod
    def get_user_by_id(cls, user_id: int) -> Optional[dict]:
        """Get user data by user_id"""
        with cls.get_session() as session:
            user = session.query(User).filter(User.user_id == user_id).first()
            if not user:
                return None
            return UserSchema().dump(user)

    @classmethod
    def get_user_by_username(cls, username: str) -> Optional[dict]:
        """Get user data by username"""
        with cls.get_session() as session:
            user = session.query(User).filter(User.username == username).first()
            if not user:
                return None
            return UserSchema().dump(user)

    @classmethod
    def get_user_by_email(cls, email: str) -> Optional[dict]:
        """Get user by email"""
        with cls.get_session() as session:
            user = session.query(User).filter(User.email == email).first()
            return UserSchema().dump(user)

    @classmethod
    def get_user_id(cls, username: str) -> Optional[int]:
        """Get user ID by username"""
        with cls.get_session() as session:
            user_id = (
                session.query(User.user_id).filter(User.username == username).first()
            )
            return user_id[0] if user_id else None

    @classmethod
    def get_username(cls, user_id: int) -> Optional[str]:
        """Get username by user ID"""
        with cls.get_session() as session:
            username = (
                session.query(User.username).filter(User.user_id == user_id).first()
            )
            return username[0] if username else None

    @classmethod
    def user_exists(cls, username: str) -> bool:
        """Check if user exists"""
        with cls.get_session() as session:
            exists = (
                session.query(User.user_id).filter(User.username == username).first()
            )
            return exists is not None
