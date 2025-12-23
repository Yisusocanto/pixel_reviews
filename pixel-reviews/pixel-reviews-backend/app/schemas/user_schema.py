from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models.user import User


class UserSchema(SQLAlchemySchema):
    class Meta:
        model = User

    user_id = auto_field(data_key="userID")
    email = auto_field()
    username = auto_field()
    bio = auto_field()
    location = auto_field()
    website = auto_field()
    avatar_url = auto_field(data_key="avatarUrl")
    created_at = auto_field(data_key="createdAt")

    # Properties
    average_rating = fields.Method("get_average_rating", data_key="averageRating")
    total_ratings = fields.Method("get_total_ratings", data_key="totalRatings")
    total_reviews = fields.Method("get_total_reviews", data_key="totalReviews")
    total_likes = fields.Method("get_total_likes", data_key="totalLikes")

    def get_average_rating(self, obj):
        return obj.average_rating

    def get_total_ratings(self, obj):
        return obj.total_ratings

    def get_total_reviews(self, obj):
        return obj.total_reviews

    def get_total_wishlist(self, obj):
        return obj.total_wishlist

    def get_total_likes(self, obj):
        return obj.total_likes
