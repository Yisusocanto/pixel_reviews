from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, desc, exc
from app.models import User, Game, Review, Rating, Developer, Publisher
from datetime import datetime
from typing import List
from app.services.rawg_api import RawgApi
from datetime import date
from app.schemas.game_schema import GameSchema
from app.schemas.review_schema import ReviewSchema
from app.schemas.rating_schema import RatingSchema
from app.schemas.user_schema import UserSchema
from app.schemas.developer_schema import DeveloperSchema
from app.schemas.publisher_schema import PublisherSchema

rawg_api = RawgApi()


class DatabaseManager:
    """Class Handling Database Management"""

    def __init__(self):
        self.engine = create_engine(
            "postgresql://postgres:Blonde1984@localhost/pixel_reviews"
        )
        self.Session = sessionmaker(self.engine)
        self.session = self.Session()

    # Users
    def create_user(
        self, email: str, password: str, username: str, name: str, lastname: str, age
    ) -> int | dict:
        """Method that is responsible for creating users in the database
        - return the 'user_id' if the creation is successful
        - return a 'dict' with a error message if there is an exception"""
        try:
            birth_date = datetime.strptime(age, "%Y-%m-%d")  # Convertir a datetime
            user = User(
                email=email,
                password=password,
                username=username,
                name=name,
                lastname=lastname,
                age=birth_date,
            )
            self.session.add(user)
            self.session.commit()

            return (
                self.session.query(User.user_id)
                .filter(User.username == username)
                .first()[0]
            )

        except exc.IntegrityError as i:
            self.session.rollback()
            error_msg = str(i.orig)
            if "email" in error_msg:
                return {"error": "The email is already registered."}
            elif "username" in error_msg:
                return {"error": "The username is already registered."}
            else:
                print("Integrity Error de SqlAlchemy en create user", i)
                return {"error": "Database integrity error."}

        except Exception as e:
            self.session.rollback()
            print("error on create user", e)
            return {"error": "An unknown error occurred while creating the user."}

    def check_user_exits(self, username: str) -> str | None:
        """check if the user exits in the database
        - return the 'hashed password' if the user exits
        - return 'None' if the user do not exits"""
        hashed_password = (
            self.session.query(User.password).filter(User.username == username).first()
        )
        if hashed_password:
            return hashed_password[0]
        else:
            return None

    def returnig_user_id(self, username: str) -> int | None:
        """return the 'user_id' if the user exits, instead, return 'None'"""
        user_id = (
            self.session.query(User.user_id).filter(User.username == username).first()
        )
        if user_id:
            return user_id[0]
        else:
            return None

    def returnig_username(self, user_id: int) -> str | None:
        """return the 'username' if the user exits, instead, return 'None'"""
        username = (
            self.session.query(User.username).filter(User.user_id == user_id).first()
        )
        if username:
            return username[0]
        else:
            return None

    def returning_user_data(self, username: str) -> dict | None:
        """Method that return the data of the user
        - return a serialized object with the data of the user if exits
        - return 'None' if the user do not exits"""
        user = self.session.query(User).filter(User.username == username).first()
        if not user:
            return None
        else:
            serialized_user = UserSchema().dump(user)
            return serialized_user

    # Reviews----------------------------------
    def get_review_count(self, reviews_count: int) -> List:
        """Method that returns the number of reviews passed as an argument"""
        reviews = (
            self.session.query(Review)
            .order_by(desc(Review.created_at))
            .limit(reviews_count)
        )
        serialized_reviews = ReviewSchema().dump(reviews, many=True)
        return serialized_reviews

    def create_or_update_review(self, game_id, user_id, title, content) -> str:
        """Method that creates or updates a review of the database"""
        review = (
            self.session.query(Review)
            .filter(Review.game_id == game_id, Review.user_id == user_id)
            .first()
        )

        if review:
            review.title = title
            review.content = content
        else:
            new_review = Review(
                game_id=game_id, user_id=user_id, title=title, content=content
            )
            self.session.add(new_review)

        self.session.commit()
        return "review saved"  # Puede que esto cambie luego y retorne la review serializada

    def get_user_review(self, game_id: int, user_id: int) -> dict | None:
        """Method that return a user's review of a specific game
        - Return the serialized review if exits
        - Return 'None' if the review do not exits"""
        review = (
            self.session.query(Review)
            .filter(Review.user_id == user_id, Review.game_id == game_id)
            .first()
        )
        if review:
            serialized_review = ReviewSchema().dump(review)
            return serialized_review
        else:
            return None

    # Games
    def get_game(self, game_slug: str) -> dict | None:
        """Method that return a 'game' based on its 'game_slug' property
        - Return the serialized game if exits
        - Return 'None' if the game do not exits"""
        game = self.session.query(Game).filter(Game.slug == game_slug).first()
        if game:
            serialized_game = GameSchema().dump(game)
            return serialized_game
        else:
            return None

    def get_game_by_his_id(self, game_id: int) -> dict | None:
        """Method that return a 'game' based on its 'game_id' property
        - Return the serialized game if exits
        - Return 'None' if the game do not exits"""
        game = self.session.query(Game).filter(Game.game_id == game_id).first()
        if game:
            serialized_game = GameSchema().dump(game)
            return serialized_game
        else:
            return None

    def save_game(
        self,
        rawg_id,
        title,
        slug,
        release_date,
        image_url,
        description,
        developer,
        publisher,
    ) -> dict:
        """Method that create a new game in the database and return it"""
        game = Game(
            rawg_id=rawg_id,
            title=title,
            slug=slug,
            release_date=release_date,
            image_url=image_url,
            description=description,
            developer=developer,
            publisher=publisher,
        )
        self.session.add(game)
        self.session.commit()

        serialized_game = GameSchema().dump(game)
        return serialized_game

    def find_or_create_game(self, slug) -> dict | None:
        """Method that searches if a Game already exits in the database. If it does not exits, it creates it and returns it.
        - Return the serialized game if it exits or is successfully created.
        - Return `None` if the game does not exits or there is an exception."""
        try:
            game = self.session.query(Game).filter(Game.slug == slug).first()
            if game:
                serialized_game = GameSchema().dump(game)
                return serialized_game

            game_data = rawg_api.get_game_details(slug)
            if not game_data:
                return None

            new_game = Game(
                rawg_id=game_data["rawg_id"],
                title=game_data["title"],
                slug=game_data["slug"],
                release_date=date.fromisoformat(game_data["release_date"]),
                image_url=game_data["image_url"],
                description=game_data["description"],
            )
            self.session.add(new_game)

            for dev_data in game_data["developers"]:
                developer = self.find_or_create_developer(
                    dev_data["rawg_id"], dev_data["name"], dev_data["slug"]
                )
                new_game.developers.append(developer)

            for pub_data in game_data["publishers"]:
                publisher = self.find_or_create_publisher(
                    pub_data["rawg_id"], pub_data["name"], pub_data["slug"]
                )
                new_game.publishers.append(publisher)

            self.session.commit()

            serialized_game = GameSchema().dump(new_game)
            return serialized_game

        except Exception as e:
            print(f"error en find or create game: {e}")
            self.session.rollback()
            raise e
            return None

    # Developers and Publishers--------------------------------------------------------------
    def find_or_create_developer(self, rawg_id, name, slug) -> Developer:
        """Method that searches if a `Developer` already exits in the database. If it does not exits, it creates it and returns it."""
        developer = self.session.query(Developer).filter(Developer.slug == slug).first()
        if developer:
            return developer

        new_developer = Developer(rawg_id=rawg_id, name=name, slug=slug)
        self.session.add(new_developer)
        return new_developer 

    def find_or_create_publisher(self, rawg_id, name, slug) -> Publisher:
        """Method that searches if a `Developer` already exits in the database. If it does not exits, it creates it and returns it."""
        publisher = self.session.query(Publisher).filter(Publisher.slug == slug).first()
        if publisher:
            return publisher

        new_publisher = Publisher(rawg_id=rawg_id, name=name, slug=slug)
        self.session.add(new_publisher)
        return new_publisher 

    # Ratings-----------------------------------------------------------------------------------

    def create_or_update_rating(self, user_id: int, game_id: int, score: int) -> str:
        """Method that creates or updates a review of the database"""
        rating = (
            self.session.query(Rating)
            .filter(Rating.user_id == user_id, Rating.game_id == game_id)
            .first()
        )

        if rating:
            rating.score = score
        else:
            new_rating = Rating(user_id=user_id, game_id=game_id, score=score)
            self.session.add(new_rating)

        self.session.commit()
        return "rating saved"  # aca tambien se podria devolver el nuevo rating, luego se ve

    def get_user_rating(self, game_id: int, user_id: int) -> dict | None:
        """Method that return the serialized rating of the user if it exits, return `None` instead"""
        rating = (
            self.session.query(Rating)
            .filter(Rating.user_id == user_id, Rating.game_id == game_id)
            .first()
        )

        if rating:
            serialized_rating = RatingSchema().dump(rating)
            return serialized_rating
        else:
            return None
