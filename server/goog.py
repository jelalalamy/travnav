import os, requests, redis
from os.path import join, dirname
from dotenv import load_dotenv

r = redis.Redis(host='redis', port=6379, decode_responses=True)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

def computeRouteMatrix(addresses):
  # attempt to retrieve from redis cache
  numMisses = 0
  routeMatrix = [[0] * len(addresses) for _ in range(len(addresses))]
  for i in range(len(addresses)):
    for j in range(len(addresses)):
      distance = r.get(f'{addresses[i]}:{addresses[j]}')
      if distance is None:
        numMisses += 1
      else:
        routeMatrix[i][j] = int(distance)
  
  if numMisses == 0:
    print('cache hit')
    return routeMatrix

  # otherwise retrieve from google api
  url = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix'
  origins = [{
              'waypoint': {
                'address': address
              },
              "routeModifiers": { "avoid_ferries": True}
             } 
             for address in addresses]
  destinations = [{
                   'waypoint': {
                     'address': address
                   }
                  } 
                  for address in addresses]
  body = {'origins': origins, 'destinations': destinations, 'travelMode': 'DRIVE', 'routingPreference': 'TRAFFIC_AWARE'}
  headers = {'Content-Type': 'application/json',
             'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status,condition',
             'X-Goog-Api-Key': os.environ.get('GMK')}
  
  res = requests.post(url, json=body, headers=headers)
  routesApiResponse = res.json()
  # trap: [[v]*n]*n is a trap because * copies the address of the object(list)
  routeMatrix = [[0] * len(addresses) for _ in range(len(addresses))]

  for route in routesApiResponse:
    origin = route['originIndex']
    destination = route['destinationIndex']
    distance = route['distanceMeters'] if 'distanceMeters' in route else 0
    routeMatrix[origin][destination] = distance
    # add to cache
    r.set(f'{addresses[origin]}:{addresses[destination]}', distance)

  return routeMatrix
