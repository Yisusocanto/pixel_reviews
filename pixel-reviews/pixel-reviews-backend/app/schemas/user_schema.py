from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models.user import User


class UserSchema(SQLAlchemySchema):
    class Meta:
        model = User

    user_id = auto_field()
    email = auto_field()
    username = auto_field()
    name = auto_field()
    lastname = auto_field()
    age = auto_field(data_key="birthday")
    bio = auto_field()
    location = auto_field()
    website = auto_field()
    created_at = auto_field(data_key="createdAt")

    # Relationships
    reviews = fields.Nested("ReviewSchema", many=True, exclude=("author",))
    ratings = fields.Nested("RatingSchema", many=True, exclude=("author",))

    # Propertys
    average_rating = fields.Method("get_average_rating", data_key="averageRating")
    total_ratings = fields.Method("get_total_ratings", data_key="totalRatings")
    total_reviews = fields.Method("get_total_reviews", data_key="totalReviews")

    def get_average_rating(self, obj):
        return obj.average_rating

    def get_total_ratings(self, obj):
        return obj.total_ratings

    def get_total_reviews(self, obj):
        return obj.total_reviews
