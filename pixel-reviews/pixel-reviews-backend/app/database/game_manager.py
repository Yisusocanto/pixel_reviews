from app.database.base import DatabaseBase
from app.models import Game, Developer, Publisher, WishlistItem
from app.schemas.game_schema import GameSchema
from app.services.rawg_api import RawgApi
from datetime import date
from typing import Optional


class GameManager(DatabaseBase):
    """Manages game operations"""

    @classmethod
    def get_game_by_slug(cls, game_slug: str) -> Optional[dict]:
        """Get game by slug"""
        with cls.get_session() as session:
            game = session.query(Game).filter(Game.slug == game_slug).first()
            if not game:
                return None
            return GameSchema().dump(game)

    @classmethod
    def get_game_by_id(cls, game_id: int) -> Optional[dict]:
        """Get game by ID"""
        with cls.get_session() as session:
            game = session.query(Game).filter(Game.game_id == game_id).first()
            if not game:
                return None
            return GameSchema().dump(game)

    @classmethod
    def find_or_create_game(cls, slug: str) -> Optional[dict]:
        """Find existing game or create from RAWG API"""
        try:
            with cls.get_session() as session:
                game = session.query(Game).filter(Game.slug == slug).first()
                if game:
                    return GameSchema().dump(game)

                # Fetch from API if the game does not exit
                game_data = RawgApi().get_game_details(slug)
                if not game_data:
                    return None

                # Create new game
                new_game = Game(
                    rawg_id=game_data["rawg_id"],
                    title=game_data["title"],
                    slug=game_data["slug"],
                    release_date=date.fromisoformat(game_data["release_date"]),
                    image_url=game_data["image_url"],
                    screenshots=game_data["screenshots"],
                    description=game_data["description"],
                )
                session.add(new_game)

                # Add developers
                for dev_data in game_data["developers"]:
                    developer = cls._find_or_create_developer(
                        session, dev_data["rawg_id"], dev_data["name"], dev_data["slug"]
                    )
                    new_game.developers.append(developer)

                # Add publishers
                for pub_data in game_data["publishers"]:
                    publisher = cls._find_or_create_publisher(
                        session, pub_data["rawg_id"], pub_data["name"], pub_data["slug"]
                    )
                    new_game.publishers.append(publisher)

                session.flush()
                return GameSchema().dump(new_game)

        except Exception as e:
            print(f"Error in find_or_create_game: {e}")
            return None

    @staticmethod
    def _find_or_create_developer(
        session, rawg_id: int, name: str, slug: str
    ) -> Developer:
        """Internal helper to find or create developer"""
        developer = session.query(Developer).filter(Developer.slug == slug).first()
        if developer:
            return developer

        new_developer = Developer(rawg_id=rawg_id, name=name, slug=slug)
        session.add(new_developer)
        return new_developer

    @staticmethod
    def _find_or_create_publisher(
        session, rawg_id: int, name: str, slug: str
    ) -> Publisher:
        """Internal helper to find or create publisher"""
        publisher = session.query(Publisher).filter(Publisher.slug == slug).first()
        if publisher:
            return publisher

        new_publisher = Publisher(rawg_id=rawg_id, name=name, slug=slug)
        session.add(new_publisher)
        return new_publisher

    @classmethod
    def in_user_wishlist(cls, user_id: int, game_id: int):
        """Check if a game is on the user's wishlist"""
        with cls.get_session() as session:
            wishlist_item = (
                session.query(WishlistItem)
                .filter(
                    WishlistItem.user_id == user_id, WishlistItem.game_id == game_id
                )
                .first()
            )
            if not wishlist_item:
                return False

            return True
