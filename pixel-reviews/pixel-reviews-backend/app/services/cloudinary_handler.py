import dotenv
import cloudinary
from cloudinary.uploader import upload, destroy
from typing import Optional

dotenv.load_dotenv()


class CloudinaryHandler:
    """Class that handles the uploading and deletion of files from the Cloudinary cloud"""

    config = cloudinary.config(secure=True)

    @classmethod
    def upload_avatar(cls, file) -> Optional[dict]:
        """
        A method that allows uploading a file to the Cloudinary cloud.
        It receives the `file` to be uploaded as its only parameter.
        It returns a `dict` with the `public_id and secure_url` if the upload was successful; otherwise, it returns `None`.
        """
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

    @classmethod
    def delete_avatar(cls, avatar_public_id: str) -> Optional[str]:
        """A method that allows the deletion of a file from the Cloudinary cloud.
        It receives the file's `public_id` as the only parameter.
        It returns a `string` with the status response of the request ("ok", "not found") or returns `None` if there was an error.
        """
        try:
            result = destroy(avatar_public_id, invalidate=True)
            return result["result"]

        except Exception as e:
            print(f"Error on delete_avatar: {e}")
            return None
