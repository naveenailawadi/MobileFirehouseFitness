from website import app
from flask import render_template


# make a home page
@app.route('/')
@app.route('/home', methods=['GET', 'POST'])
def home():
    return render_template('home.html')
