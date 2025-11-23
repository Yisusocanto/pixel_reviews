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
        """Method that update the user data.
        - Return a dict with the user data if is successful.
        - Return none if there is a problem or any error."""
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
    def save_avatar(
        cls, user_id: int, public_id: str, secure_url: str
    ) -> Optional[dict]:
        """Method that save the user's avatar data in the database. It receives the `user_id`, `public_avatar`, and `secure_url` as parameters.
        - Return a `dict` with the user data if is successful.
        - Return `None` if there is a problem or any error."""
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

    @classmethod
    def get_avatar_public_id(cls, user_id: int) -> Optional[str]:
        """Method that get the `avatar_public_id` of the user. It receives the `user_id` as its only parameter.
        - Return the `avatar_public_id` if exits.
        - Return `None` if there is a problem or any error."""
        try:
            with cls.get_session() as session:
                avatar_public_id = (
                    session.query(User.avatar_public_id)
                    .filter(User.user_id == user_id)
                    .first()
                )[0]

                if not avatar_public_id:
                    return None
                return avatar_public_id
        except Exception as e:
            print(f"Error on get_avatar_public_id: {e}")
            return None

    @classmethod
    def delete_avatar(cls, user_id: int) -> Optional[dict]:
        """Method that delete the `avatar_public_id and avatar_url` of the user.
        It receivers the `user_id` as its only parameter.
        - Return a `dict` with the user data if the deletes is successful.
        - Return `None` if there is a problem or any error."""
        try:
            with cls.get_session() as session:
                user = session.query(User).filter(User.user_id == user_id).first()
                if not user:
                    return None

                user.avatar_public_id = None
                user.avatar_url = None

                return UserSchema().dump(user)
        except Exception as e:
            print(f"Error on delete_avatar on SettingsManager: {e}")
            return None
