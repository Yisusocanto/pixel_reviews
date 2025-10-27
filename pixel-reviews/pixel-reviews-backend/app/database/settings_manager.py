from app.database.base import DatabaseBase
from app.models import User
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
    ) -> Optional[User]:
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

            return user
        except Exception as e:
            print("error on update_profile manager", e)
            return None
