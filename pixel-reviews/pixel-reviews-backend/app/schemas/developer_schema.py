from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models.developer import Developer


class DeveloperSchema(SQLAlchemySchema):
    class Meta:
        model = Developer

    developer_id = auto_field()
    name = auto_field()
    slug = auto_field()

    # Relationships
    games = fields.Nested(
        "GameSchema",
        many=True,
        exclude=("developers", "publishers", "reviews", "ratings"),
    )
