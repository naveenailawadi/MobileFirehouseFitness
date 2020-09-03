from flask_restful import Api
from api import app
from api.resources.User import UserManagementResource, LoginResource
from api.resources.Admin import AdminUserManagementResource
from api.resources.Review import ReviewDisplayResource, ReviewManagementResource


# reroute traffic
@app.route('/')
def root_page():
    return('<a href="https://mobilefirehousefitness.com">Main Site</a>')


# create an api
api = Api(app)

# add user routes
api.add_resource(UserManagementResource, '/UserManagement')
api.add_resource(LoginResource, '/Login')

# add admin route
api.add_resource(AdminUserManagementResource, '/AdminUserManagement')

# add review routes
api.add_resource(ReviewManagementResource, '/ReviewManagement')
api.add_resource(ReviewDisplayResource, '/ReviewDisplay')
