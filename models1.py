from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from datetime import datetime, timezone, timedelta
import pytz


db = SQLAlchemy()

class Admin(db.Model):
    a_id = db.Column(db.Integer(), primary_key=True)
    a_name = db.Column(db.String(50), nullable=False, unique=False)
    a_email = db.Column(db.String(100), nullable=False, unique=True)
    a_password = db.Column(db.String(50), nullable=False, unique=False)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)

    def get_id(self):
        return (self.a_id)

    def generate_access_token(self):
        expires = datetime.timedelta(hours=1) 
        access_token = create_access_token(identity=self.a_id, expires_delta=expires)
        return access_token

class User(db.Model):
    u_id = db.Column(db.Integer(), primary_key=True)
    u_name = db.Column(db.String(50), nullable=False, unique=False)
    u_email = db.Column(db.String(100), nullable=False, unique=True)
    u_password = db.Column(db.String(50), nullable=False, unique=False)
    b_book = db.relationship('Booking', backref='user')
    last_login = db.Column(db.DateTime, default=datetime.utcnow)

    def get_id(self):
        return (self.u_id)

    def generate_access_token(self):
        expires = datetime.timedelta(hours=1) 
        access_token = create_access_token(identity=self.u_id, expires_delta=expires)
        return access_token


class Venue(db.Model):
    v_id = db.Column(db.Integer(), primary_key=True)
    v_name = db.Column(db.String(100), nullable=False)
    v_place = db.Column(db.String(100), nullable=False)
    v_location = db.Column(db.String(100), nullable=False)
    v_capacity = db.Column(db.Integer(), nullable=False)
    shows = db.relationship("Show", backref="s_venue")
    booking = db.relationship("Booking", backref="b_venue")


class Show(db.Model):
    s_id = db.Column(db.Integer(), primary_key=True)
    s_name = db.Column(db.String(100), nullable=False)
    s_starttime = db.Column(db.String(50), nullable=False)
    s_endtime = db.Column(db.String(50), nullable=False)
    s_ratings = db.Column(db.String(50), nullable=False)
    s_tags = db.Column(db.String(100), nullable=False)
    s_price = db.Column(db.Integer(), nullable=False)
    venue_id = db.Column(db.Integer(), db.ForeignKey('venue.v_id'))
    bookings = db.relationship("Booking", backref="show")


class Booking(db.Model):
    b_id = db.Column(db.Integer(), primary_key=True)
    b_seatsbooked = db.Column(db.Integer(), nullable=False)
    b_show = db.Column(db.Integer(), db.ForeignKey(
        'show.s_id'), nullable=False)
    vv_id = db.Column(db.Integer(), db.ForeignKey(
        'venue.v_id'), nullable=False)
    b_user = db.Column(db.Integer(), db.ForeignKey(
        'user.u_id'), nullable=False)
    booking_datetime = db.Column(db.DateTime, nullable = False, default=datetime.now(pytz.timezone('Asia/Kolkata')).replace(second = 0, 
        microsecond = 0))

    def __init__(self, b_seatsbooked, b_show, vv_id, b_user):
        self.b_seatsbooked = b_seatsbooked
        self.b_show = b_show
        self.vv_id = vv_id
        self.b_user = b_user

