from website import app
from flask import render_template


# make a home page
@app.route('/')
@app.route('/home', methods=['GET', 'POST'])
def home():
    return render_template('home.html')


# add a corona page
@app.route('/covid')
def covid():
    return render_template('covid.html', title='COVID-19')
