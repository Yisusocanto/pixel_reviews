import secrets

def generate_reset_tooken():
    reset_token = secrets.token_urlsafe(32)
    return reset_token