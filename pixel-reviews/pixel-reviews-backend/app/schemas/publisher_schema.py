from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models.publisher import Publisher


class PublisherSchema(SQLAlchemySchema):
    class Meta:
        model = Publisher

    publisher_id = auto_field()
    name = auto_field()
    slug = auto_field()

    # Relationships
    games = fields.Nested(
        "GameSchema",
        many=True,
        exclude=("developers", "publishers", "reviews", "ratings"),
    )
