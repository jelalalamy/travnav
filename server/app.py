from flask import Flask, request
from flask_cors import CORS, cross_origin
from solver import brute_force_solve, nearest_neighbor_solve, asadpour_solve
from goog import computeRouteMatrix

app = Flask(__name__)
CORS(app)
# Set-ExecutionPolicy Unrestricted -Scope Process
# .venv\Scripts\activate
# flask --debug run

@app.get('/hello')
def hello():
    return {'data': {'path': ['hellooo'], 'msg': 'hellooo'}}

@app.post('/bestpath')
def handler():
    data = request.get_json()
    method = data['method']

    if method == 'hello':
        return hello()
    
    places = data['places']
    addresses = data['addresses']
    routeMatrix = computeRouteMatrix(addresses)
    path = ['not found']

    if method == 'brute':
        path, distances = brute_force_solve(places, routeMatrix)
    if method == 'nearest':
        path, distances = nearest_neighbor_solve(places, routeMatrix)
    if method == 'asadpour':
        path, distances = asadpour_solve(places, routeMatrix)

    return {'data': {'path': path, 'distances': distances}}
