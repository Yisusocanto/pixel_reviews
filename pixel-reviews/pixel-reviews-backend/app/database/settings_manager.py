from app.database.base import DatabaseBase
from app.models import User
from app.schemas.user_schema import UserSchema
from typing import Optional


class SettingManager(DatabaseBase):

    @classmethod
    def update_profile(
        cls,
        user_id: int,
        name: str,
        lastname: str,
        location: str,
        bio: str,
        website: str,
    ) -> Optional[dict]:
        try:
            with cls.get_session() as session:
                user = session.query(User).filter(User.user_id == user_id).first()
                if not user:
                    return None

                user.name = name
                user.lastname = lastname
                user.location = location
                user.bio = bio
                user.website = website

                return UserSchema().dump(user)
        except Exception as e:
            print("error on update_profile manager", e)
            return None

    @classmethod
    def upload_avatar(
        cls, user_id: int, public_id: str, secure_url: str
    ) -> Optional[dict]:
        try:
            with cls.get_session() as session:
                user = session.query(User).filter(User.user_id == user_id).first()
                if not user:
                    return None

                user.avatar_public_id = public_id
                user.avatar_url = secure_url

                return UserSchema().dump(user)
        except Exception as e:
            print(f"error on upload_avatar User manager: {e}")
            return None
