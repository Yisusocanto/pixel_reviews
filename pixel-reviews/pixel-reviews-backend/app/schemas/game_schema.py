from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from app.models import WishlistItem
from app.models.game import Game


class GameSchema(SQLAlchemySchema):
    class Meta:
        model = Game

    game_id = auto_field(data_key="gameID")
    title = auto_field()
    slug = auto_field()
    release_date = auto_field(data_key="releaseDate")
    image_url = auto_field(data_key="imageURL")
    screenshots = auto_field()
    description = auto_field()
    in_user_wishlist = fields.Bool(data_key="inUserWishlist")

    # Relationships
    reviews = fields.Nested("ReviewSchema", many=True, exclude=("game",))
    ratings = fields.Nested("RatingSchema", many=True, exclude=("game",))
    developers = fields.Nested("DeveloperSchema", many=True, exclude=("games",))
    publishers = fields.Nested("PublisherSchema", many=True, exclude=("games",))

    # Properties
    average_rating = fields.Method("get_average_rating", data_key="averageRating")
    total_ratings = fields.Method("get_total_ratings", data_key="totalRatings")
    total_reviews = fields.Method("get_total_reviews", data_key="totalReviews")
    total_wishlist = fields.Method("get_total_wishlist", data_key="totalWishlist")

    def get_average_rating(self, obj):
        return obj.average_rating

    def get_total_ratings(self, obj):
        return obj.total_ratings

    def get_total_reviews(self, obj):
        return obj.total_reviews

    def get_total_wishlist(self, obj):
        return obj.total_wishlist