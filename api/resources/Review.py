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
            max_stars = int(data['max_stars'])
            sort_by = data['sort_by'].lower()
            limit = int(data['limit'])
        except KeyError:
            return {'message': 'request must include max_stars, sort_by, and limit'}, 422

        # query the database
        review_request = ReviewModel.filter(ReviewModel.stars <= max_stars)

        # use the sorting
        if 'most-recent' in sort_by:
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
