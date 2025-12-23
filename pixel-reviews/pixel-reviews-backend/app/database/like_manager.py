from app.database.base import DatabaseBase
from app.models.like import Like
from sqlalchemy.exc import IntegrityError


class LikeManager(DatabaseBase):

    @classmethod
    def toggle_like(cls, user_id: int, review_id: int) -> bool | dict:
        """Creates or removed a like from a review depending on whether it existed or not"""
        try:
            with cls.get_session() as session:
                like = (
                    session.query(Like)
                    .filter(Like.review_id == review_id, Like.user_id == user_id)
                    .first()
                )
                if like:
                    session.delete(like)
                    return True

                new_like = Like(user_id=user_id, review_id=review_id)
                session.add(new_like)
                return True
        except IntegrityError as i:
            print("Error on toggle_likes integrity:", i)
            return {"error": "Like already in review."}
        except Exception as e:
            print("Error on toggle_likes:", e)
            return {"error": "Unknown error."}
