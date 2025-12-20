from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models.review import Review


class ReviewSchema(SQLAlchemySchema):
    class Meta:
        model = Review

    review_id = auto_field(data_key="reviewID")
    title = auto_field()
    content = auto_field()
    created_at = auto_field(data_key="createdAt")
    updated_at = auto_field(data_key="updatedAt")
    is_liked = fields.Bool(data_key="isLiked")

    # Relationships
    author = fields.Nested("UserSchema", exclude=("reviews", "ratings"))
    game = fields.Nested("GameSchema", exclude=("reviews", "ratings", "screenshots"))
    rating = fields.Nested("RatingSchema", exclude=("author", "game"))

    # Properties
    total_likes = fields.Method("get_total_likes", data_key="totalLikes")

    def get_total_likes(self, obj):
        return obj.total_likes