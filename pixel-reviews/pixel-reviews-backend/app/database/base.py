from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
import os
from contextlib import contextmanager
from collections.abc import Generator
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")


class DatabaseBase:
    """Base class for all database managers"""

    _engine = None
    _SessionLocal = None

    @classmethod
    def initialize(cls, database_url: str = None):
        """Initialize database connection (call once at app startup)"""
        if cls._engine is None:
            db_url = database_url or DATABASE_URL
            cls._engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=120,
                pool_size=3,
                max_overflow=5,
                pool_timeout=30,
                connect_args={
                    "keepalives": 1,
                    "keepalives_idle": 30,
                    "keepalives_interval": 10,
                    "keepalives_count": 5,
                },
            )
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
