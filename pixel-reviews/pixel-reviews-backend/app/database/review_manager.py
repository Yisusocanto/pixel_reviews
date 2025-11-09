from app.database.base import DatabaseBase
from app.models import Review, Rating
from app.schemas.review_schema import ReviewSchema
from app.schemas.rating_schema import RatingSchema
from sqlalchemy import desc
from typing import List, Optional


class ReviewManager(DatabaseBase):
    """Manages review and rating operations"""

    @classmethod
    def get_reviews(cls, limit: int, offset: int):
        """Return a limited number of reviews. ordered in descending order by their creation date."""
        try:
            with cls.get_session() as session:
                reviews = (
                    session.query(Review)
                    .order_by(desc(Review.created_at))
                    .offset(offset)
                    .limit(limit)
                    .all()
                )

                if not reviews:
                    return []
                
                return ReviewSchema().dump(reviews, many=True)
            
        except Exception as e:
            print(f"Error on get_recent_reviews: {e}")
            return "error"

    @classmethod
    def create_or_update_review(
        cls, game_id: int, user_id: int, title: str, content: str, rating_score: int
    ) -> dict:
        """Create or update a review"""
        with cls.get_session() as session:
            # Find existing review
            review = (
                session.query(Review)
                .filter(Review.game_id == game_id, Review.user_id == user_id)
                .first()
            )

            # Create or update rating first
            rating = cls._create_or_update_rating(user_id, game_id, rating_score)

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
    def _create_or_update_rating(cls, user_id: int, game_id: int, score: int) -> Rating:
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
