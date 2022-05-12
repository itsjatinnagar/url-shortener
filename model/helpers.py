from email.message import EmailMessage
import os
import smtplib
import string
import random

from flask import session

from model.sql import check_code


def generate_short_code():
    obsolete = 'lIO0'
    allowed = ''.join([('' if c in obsolete else c)
                      for c in string.ascii_letters + string.digits])
    short_code = ''
    while True:
        short_code = ''.join(random.choices(allowed, k=6))
        checkResult = check_code(short_code)
        if checkResult is True:
            break
        elif checkResult is None:
            return None
    return short_code


def generate_auth_code():
    return ''.join(random.choices(string.digits, k=6))


def email_auth_code(email: str, code):
    user = os.environ['EMAIL_ADDR']
    password = os.environ['EMAIL_PASS']
    message = EmailMessage()
    message['From'] = user
    message['To'] = email
    message['Subject'] = 'Your miniurl.cf sign in code'
    # Fallback Content
    message.set_content(
        f"Hey {email.split('@')[0]}!\n\nYour sign in code is: {code}\n\nThanks,\nThe MiniUrl Team")
    # HTML Content
    message.add_alternative(f"""\
    <!DOCTYPE html>
    <html lang="en">
    <body>
        <p style="font-size:18px;font-weight:bold;">Hey {email.split('@')[0]}!</p>
        <p style="font-size:20px;text-align:center;">Your sign in code is: <strong style="color:#2acf5f;">{code}</strong></h2>
        <p>Thanks,</p>
        <p>The MiniUrl Team</p>
    </body>
    </html>
    """, subtype='html')
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        try:
            smtp.login(user, password)
            smtp.send_message(message)
        except smtplib.SMTPException as error:
            print(f'Auth Error: {error}')
            return False
        return True
