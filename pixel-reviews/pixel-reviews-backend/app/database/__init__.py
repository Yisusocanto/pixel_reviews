from app.database.base import DatabaseBase
from app.database.user_manager import UserManager
from app.database.auth_manager import AuthManager
from app.database.game_manager import GameManager
from app.database.review_manager import ReviewManager

# Initialize database on import
DatabaseBase.initialize()

__all__ = [
    'DatabaseBase',
    'UserManager',
    'AuthManager',
    'GameManager',
    'ReviewManager',
]