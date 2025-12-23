from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models.like import Like


class LikeSchema(SQLAlchemySchema):
    class Meta:
        model = Like

    like_id = auto_field(data_key="likeID")
    created_at = auto_field(data_key="createdAt")

    # Relationships
    user = fields.Nested("UserSchema")
    review = fields.Nested("ReviewSchema", exclude=("author", "game", "rating"))
