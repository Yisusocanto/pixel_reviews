import re

def validate_username(username):
    """
    Validates that the username is alphanumeric and between 3 and 20 characters.
    """
    if not username:
        return "Username cannot be empty."
    if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
        return "Username must be alphanumeric and between 3 to 20 characters."
    return None

def validate_email(email):
    """
    Validates that the email has a proper format.
    """
    if not email:
        return "Email cannot be empty."
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
        return "Invalid email format."
    return None

def validate_password(password):
    """
    Validates that the password is at least 6 characters long and contains at least one number.
    """
    if not password:
        return "Password cannot be empty."
    if len(password) < 6:
        return "Password must be at least 6 characters long."
    if not any(char.isdigit() for char in password):
        return "Password must contain at least one number."
    return None


def execute_validations(email, username, password) -> str | None:
    """The `execute_validations` function is a higher-level function that orchestrates the validation
    process for a set of user inputs including email, username, password."""
    email_error = validate_email(email)
    if email_error:
        return email_error

    username_error = validate_username(username)
    if username_error:
        return username_error

    password_error = validate_password(password)
    if password_error:
        return password_error

    return None
