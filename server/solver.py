from typing import List
from itertools import permutations

def get_distance(places, routeMatrix, place1, place2):
    """Helper function to find the distance between two places given routeMatrix list."""
    return routeMatrix[places.index(place1)][places.index(place2)]


def rotate_list(first, places):
    """Helper function to rotate a list so that first is the first element in the list."""
    i = places.index(first)
    for _ in range(i):
        places.append(places.pop(0))
    

def brute_force_solve(places: List[str], routeMatrix: List[List[int]]) -> List[str]:
    """Brute force solution comparing all permutations of places. Not recommended for more than 7-8 places."""
    perms = permutations(places)
    bestPerm = None
    bestDistance = float('inf')
    for perm in list(perms):
        distance = 0
        for i in range(len(perm) - 1):
            distance += get_distance(places, routeMatrix, perm[i], perm[i + 1])
        if distance < bestDistance:
            bestPerm = perm
            bestDistance = distance
    # print(bestDistance)
    best = list(bestPerm)
    rotate_list(places[0], best)
    return best


def nearest_neighbor_solve(places: List[str], routeMatrix: List[List[int]]) -> List[str]:
    """Suboptimal greedy solution."""
    unvisited = set(places)
    current = places[0]
    unvisited.remove(current)
    tour = [current]
    while unvisited:
        next_place = min(unvisited, key=lambda place: routeMatrix[places.index(current)][places.index(place)])
        tour.append(next_place)
        unvisited.remove(next_place)
        current = next_place
    return tour
