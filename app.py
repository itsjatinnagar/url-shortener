from flask import Flask, render_template

app = Flask(__name__, static_folder='assets')


@app.route('/')
def index():
    return render_template('index.html')
