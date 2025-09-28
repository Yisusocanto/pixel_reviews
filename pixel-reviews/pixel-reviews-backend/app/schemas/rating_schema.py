from app.extensions.marshmallow import ma
from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models.rating import Rating


class RatingSchema(SQLAlchemySchema):
    class Meta:
        model = Rating

    rating_id = auto_field()
    score = auto_field()
    created_at = auto_field(data_key="createdAt")

    # Relationships
    author = fields.Nested("UserSchema", exclude=("ratings", "reviews"))
    game = fields.Nested("GameSchema", exclude=("ratings", "reviews"))
