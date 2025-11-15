from marshmallow_sqlalchemy import fields, auto_field, SQLAlchemySchema
from app.models.wishlist_item import WishlistItem

class WishlistItemSchema(SQLAlchemySchema):
    class Meta:
        model = WishlistItem

    wishlist_item_id = auto_field(data_key="wishlistItemId")
    added_at = auto_field(data_key="addedAt")
    # Relationships
    game = fields.Nested(
        "GameSchema", exclude=(
            "wishlist",
            "reviews",
            "ratings",
            "developers",
            "publishers",
        )
    )
    user = fields.Nested(
        "UserSchema", exclude=(
            "wishlist",
            "reviews",
            "ratings"
        )
    )