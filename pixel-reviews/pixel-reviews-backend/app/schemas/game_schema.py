from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models.game import Game


class GameSchema(SQLAlchemySchema):
    class Meta:
        model = Game

    game_id = auto_field()
    title = auto_field()
    slug = auto_field()
    release_date = auto_field(data_key="releaseDate")
    image_url = auto_field(data_key="imageURL")
    description = auto_field()

    # Relationships
    reviews = fields.Nested("ReviewSchema", many=True, exclude=("game",))
    ratings = fields.Nested("RatingSchema", many=True, exclude=("game",))
    developers = fields.Nested("DeveloperSchema", many=True, exclude=("games",))
    publishers = fields.Nested("PublisherSchema", many=True, exclude=("games",))

    # Property
    average_rating = fields.Method("get_average_rating", data_key="averageRating")

    def get_average_rating(self, obj):
        return obj.average_rating
