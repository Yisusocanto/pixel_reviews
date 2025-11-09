import resend
import os
from dotenv import load_dotenv
from flask import render_template

load_dotenv()


class EmailSender:
    API_KEY = os.getenv("API_RESEND_KEY")
    resend.api_key = API_KEY

    def welcome_email(self, destination: str, username: str):
        try:
            html = render_template("welcome_email.html", username=username)
            email_id = resend.Emails.send(
                {
                    "from": "Pixel reviews <onboarding@resend.dev>",
                    "to": [destination],
                    "subject": "Welcome to Pixel Reviews community",
                    "html": html,
                }
            )
            print("email_id:", email_id)
            return email_id
        except Exception as e:
            print("Error sending email:", e)
            return f"error: {e}"

    def reset_token_email(self, destination: str, username: str, reset_token: str):
        try:
            reset_url = f"http://localhost:5173/auth/password_reset?token={reset_token}"
            html = render_template(
                "password_reset_email.html", username=username, reset_url=reset_url
            )
            email_id = resend.Emails.send(
                {
                    "from": "Pixel Reviews <onboarding@resend.dev>",
                    "to": [destination],
                    "subject": "Password reset",
                    "html": html,
                }
            )
            return email_id
        except Exception as e:
            print(e)
