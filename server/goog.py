import requests
from responses import sampleRoutesMatrixResponse

def computeRouteMatrix(places):
  # actual google api response later
  routesApiResponse = sampleRoutesMatrixResponse
  # trap: [[v]*n]*n is a trap because * copies the address of the object(list)
  routeMatrix = [[0] * len(places) for _ in range(len(places))]

  for route in routesApiResponse:
    origin = route['originIndex']
    destination = route['destinationIndex']
    distance = route['distanceMeters'] if 'distanceMeters' in route else 0
    routeMatrix[origin][destination] = distance

  return routeMatrix
