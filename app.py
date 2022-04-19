from flask import Flask, jsonify, render_template, request

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
        return jsonify(status=200, message='OK')
    else:
        return jsonify(status=400, message=validate)
