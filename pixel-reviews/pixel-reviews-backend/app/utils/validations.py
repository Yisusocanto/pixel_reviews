import re
from datetime import datetime

def validate_username(username):
    """
    Validates that the username is alphanumeric and between 3 to 20 characters.
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

def validate_name(name):
    """
    Validates that the name contains only alphabetic characters and is not empty.
    """
    if not name:
        return "Name cannot be empty."
    if not re.match(r'^[a-zA-Z\s]+$', name):
        return "Name must contain only alphabetic characters."
    return None

def validate_lastname(lastname):
    """
    Validates that the lastname contains only alphabetic characters and is not empty.
    """
    if not lastname:
        return "Lastname cannot be empty."
    if not re.match(r'^[a-zA-Z\s]+$', lastname):
        return "Lastname must contain only alphabetic characters."
    return None

def validate_age(age):
    """
    Validates that the age is a valid date in the past.
    """
    if not age:
        return "Age cannot be empty."
    try:
        birth_date = datetime.strptime(age, "%Y-%m-%d")
        if birth_date >= datetime.now():
            return "Age must be a date in the past."
    except ValueError:
        return "Invalid date format. Use YYYY-MM-DD."
    return None


def execute_validations(email, username, password, name, lastname, age) -> str | None:
    """The `execute_validations` function is a higher-level function that orchestrates the validation
    process for a set of user inputs including email, username, password, name, lastname, and age."""
    email_error = validate_email(email)
    if email_error:
        return email_error

    username_error = validate_username(username)
    if username_error:
        return username_error

    password_error = validate_password(password)
    if password_error:
        return password_error
    
    name_error = validate_name(name)
    if name_error:
        return name_error
    
    lastname_error = validate_lastname(lastname)
    if lastname_error:
        return lastname_error

    age_error = validate_age(age)
    if age_error:
        return age_error

    return None
