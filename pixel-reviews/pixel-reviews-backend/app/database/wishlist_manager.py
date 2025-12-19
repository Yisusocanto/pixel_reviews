from .base import DatabaseBase
from app.models.wishlist_item import WishlistItem
from app.schemas.wishlist_item_schema import WishlistItemSchema
from sqlalchemy.exc import IntegrityError
from typing import Optional

class WishlistManager(DatabaseBase):
    """Class that handles wishlist items"""

    @classmethod
    def toggle_wishlist_item(cls, game_id: int, user_id: int):
        try:
            with cls.get_session() as session:
                wishlist_item = session.query(WishlistItem).filter(WishlistItem.game_id == game_id, WishlistItem.user_id == user_id).first()
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