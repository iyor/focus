#!env/bin/python3

from flask import Flask

app = Flask(__name__)

from blocker import routes
