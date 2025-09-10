from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, desc
from app.models import User, Game, Review, Rating, Developer, Publisher
from datetime import datetime
from typing import List
from app.services.rawg_api import RawgApi
from datetime import date

rawg_api = RawgApi()

class DatabaseManager:
    """Class Handling Database Management"""
    def __init__(self):
        self.engine = create_engine("postgresql://postgres:Blonde1984@localhost/pixel_reviews")
        self.Session = sessionmaker(self.engine)
        self.session = self.Session()

    #Users
    def create_user(self, email: str, password: str, username: str, name: str, lastname: str, age):
        """create an user and return his user_id"""
        try:
            birth_date = datetime.strptime(age, "%Y-%m-%d")  # Convertir a datetime
            user = User(email=email, password=password, username=username, name=name, lastname=lastname, age=birth_date)
            self.session.add(user)
            self.session.commit()

            return self.session.query(User.user_id).filter(
                User.username == username
            ).first()[0]
        except Exception as e:
            self.session.rollback()  # Realizar rollback en caso de error
            raise e

    def check_user_exits(self, username: str):
        """check if the user exits in the database and return his password"""
        hashed_password = self.session.query(User.password).filter(User.username == username).first()
        if hashed_password:
            return hashed_password[0]
        else:
            return None
    
    def returnig_user_id(self, username: str):
        """return the user_id"""
        user_id = self.session.query(User.user_id).filter(User.username == username).first()
        if user_id:
            return user_id[0]
        else:
            return None
    
    def returnig_username(self, user_id: int):
        """return the user_id"""
        username = self.session.query(User.username).filter(User.user_id == user_id).first()
        if username:
            return username[0]
        else:
            return None

    def returning_user_data(self, username: str):
        """return the data of the user"""
        user = self.session.query(User).filter(
            User.username == username
        ).first()
        if not user:
            return None
        else:
            return user


    #Reviews----------------------------------
    def get_review_count(self, reviews_count: int) -> List[Review]:
        """Method that returns the number of reviews passed as an argument"""
        reviews = self.session.query(Review).order_by(desc(Review.created_at)).limit(reviews_count)
        return reviews
    
    def create_or_update_review(self, game_id, user_id, title, content):
        review = self.session.query(Review).filter(
            Review.game_id == game_id,
            Review.user_id == user_id
        ).first()

        if review:
            review.title = title
            review.content = content
        else:
            new_review = Review(game_id=game_id, user_id=user_id, title=title, content=content)
            self.session.add(new_review)

        self.session.commit()
        return "review saved"
        
    def get_user_review(self, user_id, game_id):
        review = self.session.query(Review).filter(Review.user_id == user_id, Review.game_id == game_id).first()
        return review if review else None

    #Games
    def get_game(self, game_slug: str) -> Game|None:
        game = self.session.query(Game).filter(Game.slug == game_slug).first()
        return game
    
    def get_game_by_his_id(self, game_id: int):
        game = self.session.query(Game).filter(Game.game_id == game_id).first()
        return game
    
    def save_game(self, rawg_id, title, slug, release_date, image_url, description, developer, publisher):
        game = Game(
            rawg_id=rawg_id,
            title=title,
            slug=slug,
            release_date=release_date,
            image_url=image_url,
            description=description,
            developer=developer,
            publisher=publisher
        )
        self.session.add(game)
        self.session.commit()
        return game
    

    #Developers and Publishers--------------------------------------------------------------
    def find_or_create_developer(self, rawg_id, name, slug):
        developer = self.session.query(Developer).filter(Developer.slug == slug).first()
        if developer:
            return developer
        
        new_developer = Developer(rawg_id=rawg_id, name=name, slug=slug)
        self.session.add(new_developer)
        return new_developer
    
    def find_or_create_publisher(self, rawg_id, name, slug):
        publisher = self.session.query(Publisher).filter(Publisher.slug == slug).first()
        if publisher:
            return publisher
        
        new_publisher = Publisher(rawg_id=rawg_id, name=name, slug=slug)
        self.session.add(new_publisher)
        return new_publisher
    
    def find_or_create_game(self, slug):
        try:
            game = self.session.query(Game).filter(Game.slug == slug).first()
            if game:
                return game
            
            game_data = rawg_api.get_game_details(slug)

            new_game = Game(
                rawg_id=game_data["rawg_id"],
                title=game_data["title"],
                slug=game_data["slug"],
                release_date=date.fromisoformat(game_data["release_date"]),
                image_url=game_data["image_url"],
                description=game_data["description"]
            )

            self.session.add(new_game)
            
            for dev_data in game_data["developers"]:
                developer = self.find_or_create_developer(dev_data["rawg_id"], dev_data["name"], dev_data["slug"])
                new_game.developers.append(developer)

            for pub_data in game_data["publishers"]:
                publisher = self.find_or_create_publisher(pub_data["rawg_id"], pub_data["name"], pub_data["slug"])
                new_game.publishers.append(publisher)

            
            self.session.commit()
            
            return new_game
        except Exception as e:
            print(f"error en find or create game: {e}")
            self.session.rollback()
            return "Ocurrio un error"


    #Ratings-----------------------------------------------------------------------------------

    def create_or_update_rating(self, user_id, game_id, score):
        rating = self.session.query(Rating).filter(
            Rating.user_id == user_id,
            Rating.game_id == game_id
        ).first()

        if rating:
            rating.score = score
        else:
            new_rating = Rating(user_id=user_id, game_id=game_id, score=score)
            self.session.add(new_rating)
        
        self.session.commit()
        return "rating saved"
    
    def get_rating(self, game_id, user_id):
        rating = self.session.query(Rating).filter(
            Rating.user_id == user_id,
            Rating.game_id == game_id
        ).first()

        return rating if rating else None

