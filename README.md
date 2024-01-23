requirements.txt

amqp==5.1.1
aniso8601==9.0.1
async-timeout==4.0.2
Babel==2.12.1
billiard==4.1.0
blinker==1.6.2
cachelib==0.9.0
celery==5.3.1
click==8.1.6
click-didyoumean==0.3.0
click-plugins==1.1.1
click-repl==0.3.0
DateTime==5.2
dnspython==2.4.1
email-validator==2.0.0.post2
Flask==2.3.2
Flask-BabelEx==0.9.4
Flask-Caching==2.0.2
Flask-JWT-Extended==4.5.2
Flask-Login==0.6.2
Flask-Mail==0.9.1
Flask-Principal==0.4.0
Flask-RESTful==0.3.10
Flask-SQLAlchemy==3.0.5
Flask-WTF==1.1.1
greenlet==2.0.2
httplib2==0.22.0
idna==3.4
itsdangerous==2.1.2
Jinja2==3.1.2
kombu==5.3.1
MarkupSafe==2.1.3
passlib==1.7.4
prompt-toolkit==3.0.39
PyJWT==2.8.0
pyparsing==3.1.1
python-dateutil==2.8.2
pytz==2023.3
redis==4.6.0
six==1.16.0
speaklater==1.3
SQLAlchemy==2.0.19
typing_extensions==4.7.1
tzdata==2023.3
vine==5.0.0
wcwidth==0.2.6
Werkzeug==2.3.6
WTForms==3.0.1
zope.interface==6.0


To run the main app.py file (Use Ubuntu on Windows)

(We need different windows of Ubuntu app)

First, create a local environment and install all the prerequisites for the project given above in the requirements inside the root folder.

Activate the local environment on each window of the Ubuntu app 

1st ubuntu window
To run the app.py file use command ==> "python3 app.py" in a local environment mode.

2nd ubuntu window
Use the command "redis-server" to run the redis server in a local environment mode.

3rd ubuntu window
Use the command "celery -A app.celery worker --loglevel=INFO" to run celery worker in a local environment mode.

4th ubuntu window
Use the command "celery -A app.celery beat --max-level 2 -l info" to run celery beat in a local environment mode.
