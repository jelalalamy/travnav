from flask import Flask, request
from flask_cors import CORS, cross_origin
from solver import brute_force_solve, nearest_neighbor_solve

app = Flask(__name__)
CORS(app)
# Set-ExecutionPolicy Unrestricted -Scope Process
# .venv\Scripts\activate
# flask --debug run

@app.route('/')
def hello_world():
    return '<p>Hello, World</p>'

@app.get('/hello')
def hello():
    return {'data': 'hello'}

@app.post('/brute')
def brute_force():
    data = request.get_json()
    cities = data['cities']
    distances = data['distances']
    path = brute_force_solve(cities, distances)
    return {'data': {'path': path}}

@app.post('/nearest')
def nearest_neighbour():
    data = request.get_json()
    cities = data['cities']
    distances = data['distances']
    path = nearest_neighbor_solve(cities, distances)
    return {'data': {'path': path}}