from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
import os
from contextlib import contextmanager
from collections.abc import Generator
from dotenv import load_dotenv

load_dotenv()

# DB_HOST = os.environ.get("DB_HOST")
# DB_USER = os.environ.get("DB_USER")
# DB_PASS = os.environ.get("DB_PASS")
# DB_NAME = os.environ.get("DB_NAME")

DATABASE_URL = os.environ.get("DATABASE_URL")

class DatabaseBase:
    """Base class for all database managers"""
    
    _engine = None
    _SessionLocal = None
    
    @classmethod
    def initialize(cls, database_url: str = None):
        """Initialize database connection (call once at app startup)"""
        if cls._engine is None:
            #db_url = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
            db_url = DATABASE_URL
            cls._engine = create_engine(db_url)
            cls._SessionLocal = sessionmaker(bind=cls._engine)
    
    @classmethod
    @contextmanager
    def get_session(cls) -> Generator[Session, None, None]:
        """Context manager for database sessions"""
        if cls._SessionLocal is None:
            cls.initialize()
        
        session = cls._SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()