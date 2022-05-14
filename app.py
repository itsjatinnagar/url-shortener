from datetime import datetime
import os
from flask import Flask, jsonify, redirect, render_template, request, session, url_for

from model.helpers import email_auth_code, generate_auth_code, generate_short_code
from model.sql import insertURL, insertUser, read_all, read_long_url, read_user_id
from model.validators import validateAuthCode, validateEmail, validateURL

app = Flask(__name__, static_folder='assets')
app.secret_key = os.environ['SESSION_KEY']


@app.route('/')
def index():
    try:
        identifiers = session['id']
    except:
        identifiers = None

    if identifiers is None:
        return render_template('index.html', isAuth=False)
    else:
        records = read_all(identifiers)
        return render_template('index.html', isAuth=True, url_list=records, host=request.host_url)


@app.route('/mail-code', methods=['POST'])
def mail_auth_code():
    email = request.json['email'].strip()
    validate = validateEmail(email)
    if validate is None:
        session['email'] = email
        session['auth_code'] = generate_auth_code()
        isSuccess = email_auth_code(session['email'], session['auth_code'])
        if isSuccess:
            return jsonify(status=200, message='Verification Code Sent')
        else:
            return jsonify(status=500, message='Something Went Wrong')
    else:
        return jsonify(status=400, message=validate)


@app.route('/login', methods=['POST'])
def login():
    user_code = request.json['code'].strip()
    validate = validateAuthCode(user_code, session['auth_code'])
    if validate is None:
        user_id = read_user_id(session['email'])
        if user_id is False:
            isSuccess = False
        elif user_id is None:
            isSuccess = insertUser(session['email'])
        else:
            session.pop('auth_code')
            session['id'] = user_id[0]
            return jsonify(status=200, message='Logged In Successfully')

        if isSuccess is False:
            return jsonify(status=500, message='Something Went Wrong')
        else:
            session.pop('auth_code')
            session['id'] = read_user_id(session['email'])[0]
            return jsonify(status=200, message='Logged In Successfully')
    else:
        return jsonify(status=400, message=validate)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


@app.route('/shorten', methods=['POST'])
def shorten():
    long_url = request.json['long_url'].strip()
    validate = validateURL(long_url)
    if validate is None:
        short_code = generate_short_code()
        if short_code is None:
            isSuccess = False
        else:
            date = datetime.now().strftime('%d-%m-%Y %H:%M:%S')
            # URL Insert
            isSuccess = insertURL(session['id'], short_code, long_url, date)
        if isSuccess is False:
            return jsonify(status=500, message='Something Went Wrong')
        else:
            return jsonify(status=200, message='URL Shortened Successfully', long_url=long_url, short_url=short_code)
    else:
        return jsonify(status=400, message=validate)


@app.route('/<short_code>')
def redirection(short_code):
    long_url = read_long_url(short_code)
    if long_url is None:
        return redirect(url_for('index'))

    return redirect(long_url[0])
