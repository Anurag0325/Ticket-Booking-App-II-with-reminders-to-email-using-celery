from flask import Flask, render_template, request, jsonify, send_file, current_app
from models1 import *
from flask_restful import Api, Resource, reqparse
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, unset_jwt_cookies
from celery_worker import make_celery
from celery_worker import *
from celery.schedules import crontab
from datetime import datetime, time as dt_time, timedelta
from flask_mail import Mail, Message
import smtplib
import threading
import csv
import os
import time
from flask_caching import Cache
from pytz import timezone
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from httplib2 import Http
from sqlalchemy import extract

app = Flask(__name__)
mail = Mail(app)
cache = Cache(app)

app.config['SQLALCHEMY_DATABASE_URI']  = "sqlite:///ticketdb1.sqlite3"
app.config['SECRET_KEY'] = "anuragiitmadras"

app.config.update(
    broker_url = 'redis://localhost:6379/1',
    result_backend = 'redis://localhost:6379/2'
)

cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})

celery = make_celery(app)

jwt = JWTManager(app)

cache.init_app(app)
db.init_app(app)
api = Api(app)

@app.route("/")
@cache.cached(timeout=3600)
def home():
    return render_template("index.html")

parser = reqparse.RequestParser()

############################################################    ADMIN API   #########################################################

class AdminApi(Resource):
    @cache.cached(timeout=60)
    def get(self):
        admin = Admin.query.all()
        i = 1
        all_admin = {}
        for a in admin:
            this_admin = {}
            this_admin["a.id"] = a.a_id
            this_admin["a.name"] = a.a_name
            this_admin["a.email"] = a.a_email
            this_admin["a.password"] = a.a_password
            all_admin[f'admin_{i}'] = this_admin
            i += 1
        return all_admin

    def post(self):
        parser.add_argument('a_name', type=str, required=True)
        parser.add_argument('a_email', type=str, required=True)
        parser.add_argument('a_password', type=str, required=True)
        args = parser.parse_args()

        a1 = Admin(a_name = args['a_name'], a_email = args['a_email'], a_password = args['a_password'])
        db.session.add(a1)
        db.session.commit()
        return {
            "message" : "Admin registered successfully"
        }, 201

api.add_resource(AdminApi, "/adminget", "/adminreg")

############################################################    User API   #########################################################

class UserApi(Resource):
    @cache.cached(timeout=60)
    def get(self):
        user = User.query.all()
        i = 1
        all_user = {}
        for u in user:
            this_user = {}
            this_user["u.id"] = u.u_id
            this_user["u.name"] = u.u_name
            this_user["u.email"] = u.u_email
            this_user["u.password"] = u.u_password

            all_user[f'user_{i}'] = this_user
            i += 1
        return all_user

    def post(self):
        parser.add_argument('u_name', type=str, required=True)
        parser.add_argument('u_email', type=str, required=True)
        parser.add_argument('u_password', type=str, required=True)
        args = parser.parse_args()

        u1 = User(u_name = args['u_name'], u_email = args['u_email'], u_password = args['u_password'])
    
        db.session.add(u1)
        db.session.commit()
        return {
            "message" : "User registered successfully"
        }, 201

api.add_resource(UserApi, "/userget", "/userreg")

############################################################    Venue API   #########################################################

class VenueApi(Resource):
    def get(self, venue_id=None):
        if venue_id is None:
            venues = Venue.query.all()
            venue_list = [
                {
                    "v_id": venue.v_id,
                    "v_name": venue.v_name,
                    "v_place": venue.v_place,
                    "v_location": venue.v_location,
                    "v_capacity": venue.v_capacity,
                }
                for venue in venues
            ]
            return jsonify(venues=venue_list)
        else:
            venue = Venue.query.get(venue_id)
            if venue:
                venue_data = {
                    "v_id": venue.v_id,
                    "v_name": venue.v_name,
                    "v_place": venue.v_place,
                    "v_location": venue.v_location,
                    "v_capacity": venue.v_capacity,
                }
                return jsonify(venue_data)
            else:
                return {"message": "Venue not found"}, 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("v_name", type=str, required=True)
        parser.add_argument("v_place", type=str, required=True)
        parser.add_argument("v_location", type=str, required=True)
        parser.add_argument("v_capacity", type=int, required=True)
        args = parser.parse_args()

        v1 = Venue(
            v_name=args["v_name"],
            v_place=args["v_place"],
            v_location=args["v_location"],
            v_capacity=args["v_capacity"],
        )
        db.session.add(v1)
        db.session.commit()
        return {"message": "Venue added successfully"}, 201

    def put(self, venue_id):
        parser = reqparse.RequestParser()
        parser.add_argument("v_name", type=str, required=True)
        parser.add_argument("v_place", type=str, required=True)
        parser.add_argument("v_location", type=str, required=True)
        parser.add_argument("v_capacity", type=int, required=True)
        args = parser.parse_args()

        venue = Venue.query.get(venue_id)
        if venue:
            venue.v_name = args["v_name"]
            venue.v_place = args["v_place"]
            venue.v_location = args["v_location"]
            venue.v_capacity = args["v_capacity"]
            db.session.commit()
            return {"message": "Venue updated successfully"}, 200
        else:
            return {"message": "Venue not found"}, 404

    def delete(self, venue_id):
        venue = Venue.query.get(venue_id)
        if venue:
            db.session.delete(venue)
            db.session.commit()
            return {"message": "Venue deleted successfully"}, 200
        else:
            return {"message": "Venue not found"}, 404

api.add_resource(VenueApi, "/venueget", "/venueget/<int:venue_id>", "/venuereg", "/delete/<int:venue_id>")


############################################################    VenuebyShowId API   #########################################################

class VenuebyShowId(Resource):
    def get(self, s_id):
        show = Show.query.get(s_id)
        if show is None:
            return {'message': 'Show not found'}, 404

        venue = show.s_venue
        if venue is None:
            return {'message': 'Venue not found for this show'}, 404

        venue_data = {
            'v_id': venue.v_id,
            'v_name': venue.v_name,
            'v_place': venue.v_place,
            'v_location': venue.v_location,
            'v_capacity': venue.v_capacity
        }

        return venue_data

api.add_resource(VenuebyShowId, '/venue/<int:s_id>')

############################################################    VenuebyPlace API   #########################################################

class VenuebyPlaceApi(Resource):
    def get(self, v_place=None):
        if v_place is None:
            venues = Venue.query.all()
            venue_list = [
                {
                    "v_id": venue.v_id,
                    "v_name": venue.v_name,
                    "v_place": venue.v_place,
                    "v_location": venue.v_location,
                    "v_capacity": venue.v_capacity,
                }
                for venue in venues
            ]
            return jsonify(venues=venue_list)
        else:
            venues = Venue.query.filter_by(v_place=v_place).all()
            if venues:
                venue_list = []
                for v in venues:
                    venue_data = {
                        "v_id": v.v_id,
                        "v_name": v.v_name,
                        "v_place": v.v_place,
                        "v_location": v.v_location,
                        "v_capacity": v.v_capacity,
                    }
                    venue_list.append(venue_data)
                return jsonify(venues=venue_list)
            else:
                return {"message": "Venue not found for the specified place"}, 404

def serialize_show(show):
        return {
            's_id': show.s_id,
            's_name': show.s_name,
            's_starttime': show.s_starttime,
            's_endtime': show.s_endtime,
            's_ratings': show.s_ratings,
            's_tags': show.s_tags,
            's_price': show.s_price,
            'venue_id': show.venue_id
        }

api.add_resource(VenuebyPlaceApi, "/venueplace/<v_place>")

############################################################    Show API   #########################################################

class ShowResource(Resource):

    def get(self, show_id=None):
        if show_id:
            show = Show.query.filter_by(s_id=show_id).first()
            if show:
                return serialize_show(show), 200
            else:
                return {'message': 'Show not found'}, 404
        else:
            venue_id = request.args.get('venue_id')
            if venue_id:
                shows = Show.query.filter_by(venue_id=venue_id).all()
                return [serialize_show(show) for show in shows], 200
            else:
                shows = Show.query.all()
                return [serialize_show(show) for show in shows], 200

    def post(self, venue_id):
        parser.add_argument('s_name', type=str, required=True)
        parser.add_argument('s_starttime', type=str, required=True)
        parser.add_argument('s_endtime', type=str, required=True)
        parser.add_argument('s_ratings', type=str, required=True)
        parser.add_argument('s_tags', type=str, required=True)
        parser.add_argument('s_price', type=int, required=True)
        args = parser.parse_args()

        venue = Venue.query.get(venue_id)

        if not venue:
            return {"message": "Venue not found"}, 404

        s1 = Show(s_name=args["s_name"], s_starttime=args["s_starttime"], s_endtime=args["s_endtime"], s_ratings=args["s_ratings"], s_tags=args["s_tags"], s_price=args["s_price"])
        s1.s_venue = venue
        db.session.add(s1)
        db.session.commit()
        return {
            "message": "Show added successfully."
        }

    def put(self, show_id):
        show = Show.query.filter_by(s_id=show_id).first()
        if not show:
            return {'message': 'Show not found'}, 404

        parser = reqparse.RequestParser()
        parser.add_argument('s_name', type=str)
        parser.add_argument('s_starttime', type=str)
        parser.add_argument('s_endtime', type=str)
        parser.add_argument('s_ratings', type=str)
        parser.add_argument('s_tags', type=str)
        parser.add_argument('s_price', type=int)
        parser.add_argument('venue_id', type=int)
        args = parser.parse_args()

        if args['s_name']:
            show.s_name = args['s_name']
        if args['s_starttime']:
            show.s_starttime = args['s_starttime']
        if args['s_endtime']:
            show.s_endtime = args['s_endtime']
        if args['s_ratings']:
            show.s_ratings = args['s_ratings']
        if args['s_tags']:
            show.s_tags = args['s_tags']
        if args['s_price']:
            show.s_price = args['s_price']
        if args['venue_id']:
            show.venue_id = args['venue_id']

        db.session.commit()
        return serialize_show(show), 200

    def delete(self, s_id):     
        show = Show.query.get(s_id)
        if show:
            bookings_to_delete = Booking.query.filter_by(b_show=s_id).all()
            for booking in bookings_to_delete:
                db.session.delete(booking)
            db.session.delete(show)
            db.session.commit()
            return {'message': 'Show and associated bookings deleted successfully'}, 200
        else:
            return {'message': 'Show not found'}, 404


api.add_resource(ShowResource, '/shows', '/shows/<int:s_id>', "/showget", "/postshows/<int:venue_id>", "/showput/<int:show_id>", "/showget/sh/<int:show_id>")


############################################################    ShowbyVenue API   #########################################################

class ShowbyvenueApi(Resource):
    def get(self, venue_id=None):
        shows = Show.query.filter_by(venue_id=venue_id).all()
        if shows:
            show_list = [{
                "s_id": show.s_id,
                "s_name": show.s_name,
                "s_starttime": show.s_starttime,
                "s_endtime": show.s_endtime,
                "s_ratings": show.s_ratings,
                "s_tags": show.s_tags,
                "s_price": show.s_price,
                "venue_id": show.venue_id
            } for show in shows]
            return show_list, 200
        else:
            return {"message": "No shows found for the given venue_id"}, 404

api.add_resource(ShowbyvenueApi, "/shows/venue/<int:venue_id>")

##########################################################    Showbyveneuplace API   #########################################################

class ShowbyvenueplaceApi(Resource):
    def get(self, v_place=None):
        venues = Venue.query.filter_by(v_place=v_place).all()

        if not venues:
            return {"message": "Venue not found for the specified place"}, 404
        
        show_list = []
        
        for venue in venues:
            shows = Show.query.filter_by(venue_id=venue.v_id).all()
            
            for s in shows:
                show_data = {
                    "s_id": s.s_id,
                    "s_name": s.s_name,
                    "s_starttime": s.s_starttime,
                    "s_endtime": s.s_endtime,
                    "s_ratings": s.s_ratings,
                    "s_tags": s.s_tags,
                    "s_price": s.s_price,
                    "venue_id": s.venue_id,
                }
                show_list.append(show_data)

        return jsonify(show_list)

api.add_resource(ShowbyvenueplaceApi, "/shows/place/<v_place>")

############################################################    Booking API   #########################################################

class BookingApi(Resource):
    def get(self):
        booking = Booking.query.all()
        booking_list = []
        for b in booking:
            booking_data = {
                "b_id" : b.b_id,
                "b_seatsbooked" : b.b_seatsbooked,
                "b_showid" : b.b_show,
                "b_venueid" : b.vv_id,
                "b_userid" : b.b_user,
            }
            booking_list.append(booking_data)
        return jsonify(booking_list)

    def post(self):
        parser.add_argument('b_seatsbooked', type=int, required=True)
        parser.add_argument('b_show', type=int, required=True)
        parser.add_argument('vv_id', type=int, required=True)
        parser.add_argument('b_user', type=int, required=True)
        args = parser.parse_args()
        b1 = Booking(b_seatsbooked = args["b_seatsbooked"], b_show = args["b_show"], vv_id = args["vv_id"], b_user = args["b_user"])
        db.session.add(b1)
        db.session.commit()
        return {
            "message" : "Booking updated successfully."
        }

api.add_resource(BookingApi, "/bookingget", "/bookingpost")

##########################################################    BookedSeatsCount API   #########################################################

class BookedSeatsCountResource(Resource):
    def get(self, show_id):
        show = Show.query.get(show_id)

        if not show:
            return jsonify({"message": "Show not found"}), 404

        venue = Venue.query.get(show.venue_id)
        if not venue:
            return jsonify({"message": "Venue not found"}), 404

        booked_seats_count = sum(booking.b_seatsbooked for booking in show.bookings)
        available_seats = venue.v_capacity - booked_seats_count

        return jsonify({
            "bookedSeatsCount": booked_seats_count,
            "venueCapacity": venue.v_capacity,
            "availableSeats": available_seats
        })

api.add_resource(BookedSeatsCountResource, '/shows/<int:show_id>/bookedseats')

############################################################    AvailableSeats API   #########################################################

class AvailableSeatsApi(Resource):
    def get(self, show_id):
        s1 = Show.query.get(show_id)
        v1 = Venue.query.filter_by(v_id=s1.venue_id).first()
        total_seats = v1.v_capacity
        booked_seats = sum(booking.b_seatsbooked for booking in s1.bookings)
        available_seats = total_seats - booked_seats
        return {"available_seats": available_seats}

api.add_resource(AvailableSeatsApi, '/get_available_seats/<int:show_id>')

############################################################    UserLogin API   #########################################################

class UserLogin(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('u_email', help='This field cannot be blank', required=True)
        parser.add_argument('u_password', help='This field cannot be blank', required=True)
        data = parser.parse_args()

        user = User.query.filter_by(u_email=data['u_email']).first()

        if not user or user.u_password != data['u_password']:
            return {'message': 'Invalid credentials'}, 401

        user.last_login = datetime.utcnow()
        db.session.commit()

        access_token = create_access_token(identity=user.get_id())
        print(access_token)
        return {'access_token': access_token}, 200

api.add_resource(UserLogin, '/user/login')

############################################################    Admin Login API   #########################################################

class AdminLogin(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('a_email', help='This field cannot be blank', required=True)
        parser.add_argument('a_password', help='This field cannot be blank', required=True)
        data = parser.parse_args()

        admin = Admin.query.filter_by(a_email=data['a_email']).first()

        if not admin or admin.a_password != data['a_password']:
            return {'message': 'Invalid credentials'}, 401

        access_token = create_access_token(identity=admin.get_id())
        return {'access_token': access_token}, 200

api.add_resource(AdminLogin, '/admin/login')

############################################################    UserData API   #########################################################

class UserData(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user:
            return {
                'u_id': user.u_id,
                'u_name': user.u_name,
                'u_email': user.u_email,
                'role': 'user'
            }, 200
        return {'message': 'User not found'}, 404
        
api.add_resource(UserData, '/user/data')

############################################################    ADMIN Data API   #########################################################

class AdminData(Resource):
    @jwt_required()
    def get(self):
        current_admin = get_admin_by_email(request.jwt_identity)
        if not current_admin:
            return {'message': 'Admin not found'}, 404

        admin_info = {
            'a_id': current_admin.a_id,
            'a_name': current_admin.a_name,
            'a_email': current_admin.a_email
        }
        return admin_info, 200

api.add_resource(AdminData, '/admin/data')

############################################################    UserLogout API   #########################################################

class UserLogout(Resource):
    @cache.cached(timeout=3600)
    @jwt_required()
    def post(self):
        response = jsonify(message='Logout successful')
        unset_jwt_cookies(response)
        return {'message': 'Logout successful'}, 200

api.add_resource(UserLogout, '/logout')

############################################################    MonthlyReport API   #########################################################

class MonthlyReportResource(Resource):
    @cache.cached(timeout=3600)
    def post(self):
        celery.send_task('tasks.generate_monthly_report')
        return jsonify(message='Monthly report generation started')

api.add_resource(MonthlyReportResource, '/generate-monthly-report')

############################################################    ShowRating API   #########################################################

class ShowRatingResource(Resource):
    def get(self, ratings):
        s1 = Show.query.filter_by(s_ratings=ratings).all()
        s2 = Show.query.all()
        v1 = Venue.query.all()
        s_data = []
        
        for s in s2:
            if s.s_ratings >= ratings:
                s_data.append({
                    's_id': s.s_id,
                    's_name': s.s_name,
                    's_starttime': s.s_starttime,
                    's_endtime': s.s_endtime,
                    's_ratings': s.s_ratings,
                    's_tags': s.s_tags,
                    's_price': s.s_price,
                    'venue_location': next((v.v_location for v in v1 if v.v_id == s.venue_id), None)
                })

        return {'s1': s_data}

api.add_resource(ShowRatingResource, '/showrating/<string:ratings>')

############################################################    ShowTag API   #########################################################

class ShowTagResource(Resource):
    def get(self, tags):
        s1 = Show.query.filter_by(s_tags=tags).all()
        s2 = Show.query.all()
        v1 = Venue.query.all()
        s_data = []
        
        for s in s2:
            if s.s_tags == tags:
                s_data.append({
                    's_id': s.s_id,
                    's_name': s.s_name,
                    's_starttime': s.s_starttime,
                    's_endtime': s.s_endtime,
                    's_ratings': s.s_ratings,
                    's_tags': s.s_tags,
                    's_price': s.s_price,
                    'venue_location': next((v.v_location for v in v1 if v.v_id == s.venue_id), None)
                })

        return {'s1': s_data}

api.add_resource(ShowTagResource, '/showtag/<string:tags>')

############################################################    UserBooking API   #########################################################

class UserBookingResource(Resource):
    def get(self, name):
        u1 = User.query.filter_by(u_name=name).first()
        if u1:
            u_id = u1.u_id
            v2 = Venue.query.all()
            s1 = Show.query.all()
            b1 = Booking.query.all()

            user_bookings = []
            for booking in b1:
                if booking.b_user == u_id:
                    show = next((s for s in s1 if s.s_id == booking.b_show), None)
                    venue = next((v for v in v2 if v.v_id == booking.vv_id), None)
                    if show and venue:
                        user_bookings.append({
                            'b_id': booking.b_id,
                            'b_seatsbooked': booking.b_seatsbooked,
                            's_name': show.s_name,
                            'v_place': venue.v_place,
                            'v_location': venue.v_location
                        })

            return {'user_bookings': user_bookings}
        else:
            return {'message': 'User not found'}, 404

api.add_resource(UserBookingResource, '/userbooking/<string:name>')

############################################################    AllShows API   #########################################################

class AllShowsResource(Resource):
    def get(self):
        shows = Show.query.all()
        return jsonify({"shows": [
            {
                "s_id": show.s_id,
                "s_name": show.s_name,
                "s_starttime": show.s_starttime,
                "s_endtime": show.s_endtime,
                "s_ratings": show.s_ratings,
                "s_tags": show.s_tags,
                "s_price": show.s_price,
                "venue_id": show.venue_id
            }
            for show in shows
        ]})

api.add_resource(AllShowsResource, '/allshows')


###########################################################    Export Venue Celery   #########################################################

@celery.task
def export_venue_csv_async(venue_id):
    with app.app_context():
        venue = Venue.query.get(venue_id)

        if not venue:
            return jsonify({'error': 'Venue not found'}), 404

        shows = Show.query.filter_by(venue_id=venue_id).all()

        csv_data = []
        csv_data.append(['Venue Name', 'Show Name', 'Number of Bookings', 'Rating'])

        for show in shows:
            num_bookings = Booking.query.filter_by(b_show=show.s_id).count()
            csv_data.append([venue.v_name, show.s_name, num_bookings, show.s_ratings])

        filename = f'venue_{venue_id}_details.csv'
        with open(filename, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerows(csv_data)

        desktop_path = os.path.expanduser("/mnt/c/Users/Hello/OneDrive/Desktop")
        save_path = os.path.join(desktop_path, filename)
        os.rename(filename, save_path)
        return save_path

############################################################    Export CSV Api   #########################################################

@app.route('/export_venue/<int:venue_id>', methods=['GET'])
def export_venue_csv(venue_id):
    task = export_venue_csv_async.apply_async(args=[venue_id])
    saved_file_path = task.get()

    if saved_file_path:
        filename = os.path.basename(saved_file_path)
        return send_file(saved_file_path, as_attachment=True, download_name=filename)
    else:
        return jsonify({'error': 'File could not be generated'}), 500


############################################################    Monthly Report Api   #########################################################

@app.route('/monthly_report/<int:month>', methods=['GET', 'POST'])
def monthly_report(month):
    bookings = Booking.query.filter(extract('month', Booking.booking_datetime) == month).all()
    html_report = render_template('monthly_report.html', month=month, bookings=bookings)

    with open('monthly_report.html', 'w') as f:
        f.write(html_report)

    send_monthly_report.delay("akanuragkumar4@gmail.com", "22dp1000105@ds.study.iitm.ac.in", "Test mail from flask using celery and beat", "This is a temp mail.", html_report)

    return "Monthly report generated and will be sent via email shortly."

####################################################    Send Monthly Report Celery   #########################################################

@celery.task
def send_monthly_report(sender, receiver, subject, message, html_content):
    with app.app_context():
        msg = MIMEMultipart()
        msg['From'] = sender
        msg['to'] = receiver
        msg['Subject'] = subject
        msg.attach(MIMEText(message, 'plain'))

        attachment = MIMEText(html_content, _subtype='html')
        msg.attach(attachment)

        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        smtp_username = sender
        smtp_password = 'jgorjrovyomhtjdh'

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(sender, receiver, msg.as_string())

###########################################################    Send Reminder Celery  #########################################################

@celery.task
def send_reminder():
    from json import dumps

    WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAAA_7_BLEQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=5a_LLUb1242BdLc5o5DPpGCeMy_UAPrqiowLIpxWNDY"

    """Google Chat incoming webhook quickstart."""
    url = WEBHOOK_URL
    app_message = {
        'text': 'Please book a ticket'}
    message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    http_obj = Http()
    response = http_obj.request(
        uri=url,
        method='POST',
        headers=message_headers,
        body=dumps(app_message),
    )
    print(response)
    return "reminder will be sent shortly...."

############################################################    Celery Scheduler   #########################################################

@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=15, minute=59),
        send_reminder.s()
    )

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug = True)