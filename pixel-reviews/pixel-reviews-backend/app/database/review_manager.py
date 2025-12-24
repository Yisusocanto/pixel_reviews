from app.database.base import DatabaseBase
from app.models import Review, Rating
from app.models.like import Like
from app.schemas.review_schema import ReviewSchema
from app.schemas.rating_schema import RatingSchema
from sqlalchemy import desc, exists
from typing import Optional


class ReviewManager(DatabaseBase):
    """Manages review and rating operations"""

    @classmethod
    def get_reviews(
        cls, limit: int, offset: int, user_id: Optional[int] = None
    ) -> list | dict:
        """Return a limited number of reviews. ordered in descending order by their creation date."""
        try:
            with cls.get_session() as session:
                # If there is an authenticated user, the reviews are checked to see if they have their like
                if user_id:
                    has_like = cls._is_liked(user_id)

                    reviews_tuple = (
                        session.query(Review, has_like)
                        .order_by(desc(Review.created_at))
                        .offset(offset)
                        .limit(limit)
                        .all()
                    )

                    reviews = []
                    if not reviews_tuple:
                        return reviews

                    for review, is_liked in reviews_tuple:
                        review.is_liked = is_liked
                        reviews.append(review)

                    return ReviewSchema().dump(reviews, many=True)

                # If there is not authenticated user, a normal query is performed
                else:
                    reviews_tuple = (
                        session.query(Review)
                        .order_by(desc(Review.created_at))
                        .offset(offset)
                        .limit(limit)
                        .all()
                    )
                    reviews = []
                    for review in reviews_tuple:
                        review.is_liked = False
                        reviews.append(review)

                    return ReviewSchema().dump(reviews, many=True)

        except Exception as e:
            print(f"Error on get_recent_reviews: {e}")
            return {"error": "Unknown error."}

    @classmethod
    def create_or_update_review(
        cls, game_id: int, user_id: int, title: str, content: str, rating_score: int
    ) -> Optional[dict]:
        """Create or update a review"""
        with cls.get_session() as session:
            # Find existing review
            review = (
                session.query(Review)
                .filter(Review.game_id == game_id, Review.user_id == user_id)
                .first()
            )

            # Create or update rating first
            rating = cls.create_or_update_rating(user_id, game_id, rating_score)
            if not rating:
                return None

            if review:
                # Update existing review
                review.title = title
                review.content = content
                review.rating = rating
            else:
                # Create new review
                review = Review(
                    game_id=game_id,
                    user_id=user_id,
                    title=title,
                    content=content,
                    rating=rating,
                )
                session.add(review)

            session.flush()
            return ReviewSchema().dump(review)

    @classmethod
    def delete_review(cls, review_id: int) -> Optional[bool]:
        """Delete a review if it exits."""
        try:
            with cls.get_session() as session:
                review = (
                    session.query(Review).filter(Review.review_id == review_id).first()
                )
                if not review:
                    return None

                rating = review.rating
                session.delete(review)
                session.delete(rating)
                return True
        except Exception as e:
            print(f"Error on delete_review: {e}")
            return None

    @classmethod
    def get_user_review(cls, game_id: int, user_id: int) -> Optional[dict]:
        """Get user's review for a specific game"""
        with cls.get_session() as session:
            review = (
                session.query(Review)
                .filter(Review.user_id == user_id, Review.game_id == game_id)
                .first()
            )

            if not review:
                return None
            return ReviewSchema().dump(review)

    @classmethod
    def create_or_update_rating(
        cls, user_id: int, game_id: int, score: int
    ) -> Optional[Rating]:
        """Internal helper to create or update rating"""
        try:
            with cls.get_session() as session:
                rating = (
                    session.query(Rating)
                    .filter(Rating.user_id == user_id, Rating.game_id == game_id)
                    .first()
                )

                if rating:
                    rating.score = score
                else:
                    rating = Rating(user_id=user_id, game_id=game_id, score=score)
                    session.add(rating)

                return rating
        except Exception as e:
            print(f"Error on _create_or_update_rating: {e}")
            return None

    @classmethod
    def get_user_rating(cls, game_id: int, user_id: int) -> Optional[dict]:
        """Get user's rating for a specific game"""
        with cls.get_session() as session:
            rating = (
                session.query(Rating)
                .filter(Rating.user_id == user_id, Rating.game_id == game_id)
                .first()
            )

            if not rating:
                return None
            return RatingSchema().dump(rating)

    @classmethod
    def get_user_reviews(
        cls,
        target_user_id: int,
        limit: int = 10,
        offset: int = 0,
        user_id: Optional[int] = None,
    ) -> list | dict:
        """Get the most recent reviews from a specific user"""
        schema = ReviewSchema()
        try:
            with cls.get_session() as session:
                # If there is an authenticated user, the reviews are checked to see if they have their like
                if user_id:
                    has_like = cls._is_liked(user_id)

                    reviews_tuple = (
                        session.query(Review, has_like)
                        .filter(Review.user_id == target_user_id)
                        .order_by(desc(Review.updated_at))
                        .offset(offset)
                        .limit(limit)
                        .all()
                    )  # [(Review(), True or False), ...]

                    reviews = []
                    if not reviews_tuple:
                        return reviews

                    for review, is_liked in reviews_tuple:
                        review.is_liked = is_liked
                        reviews.append(review)

                    return schema.dump(reviews, many=True)

                else:
                    # If there is no authenticated user, all reviews will not receive likes
                    reviews_tuple = (
                        session.query(Review)
                        .filter(Review.user_id == target_user_id)
                        .order_by(desc(Review.updated_at))
                        .offset(offset)
                        .limit(limit)
                        .all()
                    )

                    reviews = []
                    if not reviews_tuple:
                        return reviews

                    for review in reviews_tuple:
                        review.is_liked = False
                        reviews.append(review)

                    return schema.dump(reviews, many=True)

        except Exception as e:
            print(f"Error on recent_user_review: {e}")
            return {"error": "Unknown error."}

    @classmethod
    def _is_liked(cls, user_id: int):
        return (
            exists()
            .where(Like.user_id == user_id)
            .where(Like.review_id == Review.review_id)
            .label("is_liked")
        )
