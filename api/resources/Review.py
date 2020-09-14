from flask_restful import Resource
from api.resources import load_json
from api.models import ReviewModel, object_as_dict
from api import db


# create a resource for adding a review
class ReviewDisplayResource(Resource):
    def post(self):
        # get the data
        data = load_json()

        # check for the necessary attributes
        try:
            min_stars = int(data['min_stars'])
            sort_by = data['sort_by'].lower()
            limit = int(data['limit'])
        except KeyError:
            return {'message': 'request must include min_stars, sort_by, and limit'}, 422
        except ValueError:
            return {'message': 'max_stars and limit'}

        # query the database
        review_request = ReviewModel.query.filter(
            ReviewModel.stars >= min_stars)

        # use the sorting
        if 'recent' in sort_by:
            review_request = review_request.order_by(
                db.desc(ReviewModel.creation_date))
        elif 'best' in sort_by:
            review_request = review_request.order_by(
                db.desc(ReviewModel.stars))
        elif 'worst' in sort_by:
            review_request = review_request.order_by(ReviewModel.stars)
        else:
            return {'message': 'sort_by options are most-recent, best, and worst'}, 400

        # get the reviews
        reviews_raw = review_request.limit(limit).all()
        reviews = [object_as_dict(review) for review in reviews_raw]

        return {'status': 'success', 'reviews': reviews}, 201


# create a resource for adding new reviews
class ReviewManagementResource(Resource):
    def post(self):
        data = load_json()

        # get the necessary information
        try:
            name = data['name']
            review_text = data['review_text']
            stars = int(data['stars'])
        except KeyError:
            return {'message': 'must include name, review_text, and stars'}, 422
        except ValueError:
            return {'message': 'stars must be an integer'}, 422

        # make a new review
        review = ReviewModel(name=name, review_text=review_text, stars=stars)

        # add it to the database
        db.session.add(review)

        db.session.commit()

        return {'status': 'success'}, 201
