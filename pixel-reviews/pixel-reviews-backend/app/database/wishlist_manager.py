from .base import DatabaseBase
from app.models.wishlist_item import WishlistItem
from app.schemas.wishlist_item_schema import WishlistItemSchema
from sqlalchemy.exc import IntegrityError
from typing import Optional

class WishlistManager(DatabaseBase):
    """Class that handles wishlist items"""

    @classmethod
    def add_to_wishlist(cls, user_id: int, game_id: int) -> Optional[dict]:
        """Adds a new wishlist item to the database"""
        try:
            with cls.get_session() as session:
                new_wishlist_item = WishlistItem(user_id=user_id, game_id=game_id)
                session.add(new_wishlist_item)
                session.flush()
                return WishlistItemSchema().dump(new_wishlist_item)
        except IntegrityError as i:
            print("Error on add integrity:", i)
            return {"error": "Game already in wishlist."}
        except Exception as e:
            print("Error on add_to_wishlist:", e)
            return None

    @classmethod
    def remove_from_wishlist(cls, user_id: int, game_id: int) -> dict | bool:
        """Removes a wishlist item from the database"""
        try:
            with cls.get_session() as session:
                wishlist_item = session.query(WishlistItem).filter(WishlistItem.user_id ==user_id, WishlistItem.game_id == game_id).first()
                if not wishlist_item:
                    return {"error": "WishlistItem not found."}

                session.delete(wishlist_item)
                return True
        except Exception as e:
            print("Error on remove_from_wishlist:", e)
            return {"Error": "Unknown error."}