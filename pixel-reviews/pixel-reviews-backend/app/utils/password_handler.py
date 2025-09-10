import bcrypt

def hash_password(password: str):
    """Function that encodes the password and returns it but in string type to save it in the database"""
    hashed_ps = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed_ps.decode("utf-8")

def check_password(password: str, hashed_ps: str):
    """function that returns True if the password matches the save in the database or False if it does not match"""
    return bcrypt.checkpw(password.encode("utf-8"), hashed_ps.encode("utf-8"))