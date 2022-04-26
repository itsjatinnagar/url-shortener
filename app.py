from datetime import datetime
from flask import Flask, jsonify, redirect, render_template, request

from model.helpers import generate_short_code
from model.sql import create, read_all, read_long_url
from model.validators import validateURL

app = Flask(__name__, static_folder='assets')


@app.route('/')
def index():
    identifiers = request.cookies.get('identifiers')
    if identifiers is None:
        return render_template('index.html')
    else:
        records = read_all(identifiers.split('-'))
        return render_template('index.html', url_list=records, host=request.host_url)


@app.route('/shorten', methods=['POST'])
def shorten():
    long_url = request.json['long_url']
    validate = validateURL(long_url)
    if validate is None:
        short_code = generate_short_code()
        if short_code is None:
            isSuccess = False
        else:
            date = datetime.now().strftime('%d%m%Y%H%M%S')
            # URL Insert
            isSuccess = create(short_code, long_url, date)
        if isSuccess is False:
            return jsonify(status=500, message='Something Went Wrong')
        else:
            return jsonify(status=200, id=short_code)
    else:
        return jsonify(status=400, message=validate)


@app.route('/<short_code>')
def redirection(short_code):
    long_url = read_long_url(short_code)
    if long_url is None:
        return redirect('/')

    return redirect(long_url[0])
