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
    created_at = auto_field(data_key="createdAt")

    # Relationships
    reviews = fields.Nested("ReviewSchema", many=True, exclude=("author",))
    ratings = fields.Nested("RatingSchema", many=True, exclude=("author",))

