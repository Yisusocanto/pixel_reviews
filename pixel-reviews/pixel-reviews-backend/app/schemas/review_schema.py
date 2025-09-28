from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models.review import Review


class ReviewSchema(SQLAlchemySchema):
    class Meta:
        model = Review

    review_id = auto_field()
    title = auto_field()
    content = auto_field()
    created_at = auto_field(data_key="createdAt")
    updated_at = auto_field(data_key="updatedAt")

    # Relationships
    author = fields.Nested("UserSchema", exclude=("reviews", "ratings"))
    game = fields.Nested("GameSchema", exclude=("reviews", "ratings"))
