from website import app
from flask import render_template
import os


# make a home page
@app.route('/')
@app.route('/home', methods=['GET', 'POST'])
def home():
    return render_template('home.html')


# add a corona page
@app.route('/covid')
def covid():
    return render_template('covid.html', title='COVID-19')


# add a gallery page
@app.route('/gallery')
def gallery():
    # get the gallery folder
    gallery_folder = f"{app.static_folder}/assets/img/gallery"

    # get all the files here
    files = os.listdir(gallery_folder)

    photos = [
        f"assets/img/gallery/{file}" for file in files if '.jpg' in file]

    photos.sort()

    return render_template('gallery.html', title='Gallery', photos=photos)
