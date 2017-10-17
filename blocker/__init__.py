#!env/bin/python3
import os
from tinydb import TinyDB
from flask import Flask
import time

db = TinyDB('blocker_db.json')

def create_app(config = None):
    app = Flask(__name__)

    app.config.update(dict(
        DATABASE=os.path.join(app.root_path, 'blocker_db.json'),
        HOSTS_FILE = os.path.join('/etc/hosts')
    ))

    # Apply the configs if they are specified
    app.config.update(config or {})

    @app.route('/')
    @app.route('/index')
    def index():
        return "Hello World!"

    with app.app_context():
        from routes import blockees, blocker
    return app

if __name__=='__main__':
    app = create_app()
    app.run()
