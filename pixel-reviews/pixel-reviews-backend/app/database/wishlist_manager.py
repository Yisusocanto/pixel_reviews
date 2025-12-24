from .base import DatabaseBase
from app.models.wishlist_item import WishlistItem
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc
from app.schemas.wishlist_item_schema import WishlistItemSchema


class WishlistManager(DatabaseBase):
    """Class that handles wishlist items"""

    @classmethod
    def toggle_wishlist_item(cls, game_id: int, user_id: int):
        try:
            with cls.get_session() as session:
                wishlist_item = (
                    session.query(WishlistItem)
                    .filter(
                        WishlistItem.game_id == game_id, WishlistItem.user_id == user_id
                    )
                    .first()
                )
                if wishlist_item:
                    session.delete(wishlist_item)
                    return True

                new_wishlist_item = WishlistItem(user_id=user_id, game_id=game_id)
                session.add(new_wishlist_item)
                return True
        except IntegrityError as i:
            print("Error on toggle_wishlist integrity:", i)
            return {"error": "Game already in wishlist."}
        except Exception as e:
            print("Error on toggle_wishlist:", e)
            return {"error": "Unknown error."}

    @classmethod
    def get_user_wishlist(
        cls, user_id: int, offset: int = 0, limit: int = 10
    ) -> list | dict:
        schema = WishlistItemSchema()
        try:
            with cls.get_session() as session:
                wishlist_items = (
                    session.query(WishlistItem)
                    .filter(WishlistItem.user_id == user_id)
                    .order_by(desc(WishlistItem.added_at))
                    .offset(offset)
                    .limit(limit)
                    .all()
                )
                if not wishlist_items:
                    return []

                return schema.dump(wishlist_items, many=True)

        except Exception as e:
            print(f"Error on get_recent_wishlist_items: {e}")
            return {"error": "Unknown error returning the wishlist."}
