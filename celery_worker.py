from celery import Celery

def make_celery(app):
    celery = Celery(
        "app",
        backend = app.config['result_backend'],
        broker = app.config['broker_url']
    )

    celery.conf.enable_utc = False
    celery.conf.timezone = 'Asia/Kolkata'

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery
