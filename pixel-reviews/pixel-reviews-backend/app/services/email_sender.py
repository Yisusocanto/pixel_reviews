import resend
import os
from dotenv import load_dotenv
from flask import render_template

load_dotenv()


class EmailSender:
    API_KEY = os.getenv("API_RESEND_KEY")
    resend.api_key = API_KEY

    def welcome(self, destination):
        try:
            html = render_template("index.html")
            email_id = resend.Emails.send(
                {
                    "from": "Acme <onboarding@resend.dev>",
                    "to": [destination],
                    "subject": "hello world",
                    "html": html,
                }
            )
            print("email_id:", email_id)
            return email_id
        except Exception as e:
            print("Error sending email:", e)
            return f"error: {e}"
