import dotenv
import cloudinary
from cloudinary.uploader import upload


class CloudinaryHandler:
    config = cloudinary.config(secure=True)

    @classmethod
    def upload_avatar(cls, file):
        try:
            result = upload(
                file=file,
                folder="profile_photos",
                transformation=[{"quality": "auto"}],
            )

            return {
                "public_id": result["public_id"],
                "secure_url": result["secure_url"],
            }

        except Exception as e:
            print(f"error on upload_avatar: {e}")
            return None
