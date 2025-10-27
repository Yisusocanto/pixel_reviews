from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
import os
from contextlib import contextmanager
from collections.abc import Generator
from dotenv import load_dotenv

load_dotenv()

class DatabaseBase:
    """Base class for all database managers"""
    
    _engine = None
    _SessionLocal = None
    
    @classmethod
    def initialize(cls, database_url: str = None):
        """Initialize database connection (call once at app startup)"""
        if cls._engine is None:
            local_database_url = os.getenv("LOCAL_DATABASE_URL")
            db_url = database_url or os.getenv(
                'DATABASE_URL',
                local_database_url
            )
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