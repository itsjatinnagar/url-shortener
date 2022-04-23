from datetime import datetime
from flask import Flask, jsonify, render_template, request

from model.helpers import generate_short_code
from model.sql import create
from model.validators import validateURL

app = Flask(__name__, static_folder='assets')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/shorten', methods=['POST'])
def shorten():
    long_url = request.json['long_url']
    validate = validateURL(long_url)
    if validate is None:
        short_code = generate_short_code()
        date = datetime.now().strftime('%d%m%Y%H%M%S')
        # URL Insert
        isSuccess = create(short_code, long_url, date)
        if isSuccess is False:
            return jsonify(status=500, message='Some Error Occurred')
        else:
            return jsonify(status=200, id=short_code)
    else:
        return jsonify(status=400, message=validate)
