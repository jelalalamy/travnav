from typing import List
from itertools import permutations

def get_distance(places, routeMatrix, place1, place2):
    """Helper function to find the distance between two places given routeMatrix list."""
    return routeMatrix[places.index(place1)][places.index(place2)]


def rotate_list_by_element(first, l):
    """Helper function to rotate a list so that first is the first element in the list."""
    i = l.index(first)
    for _ in range(i):
        l.append(l.pop(0))
    return i
    

def rotate_list_by_index(index, l):
    for _ in range(index):
        l.append(l.pop(0))


def brute_force_solve(places: List[str], routeMatrix: List[List[int]]) -> List[str]:
    """Brute force solution comparing all permutations of places. Not recommended for more than 7-8 places."""
    perms = permutations(places)
    bestPerm = None
    bestDistances = []
    bestDistance = float('inf')

    for perm in list(perms):
        distances = []
        for i in range(len(perm) - 1):
            distances.append(get_distance(places, routeMatrix, perm[i], perm[i + 1]))
        distances.append(get_distance(places, routeMatrix, perm[-1], perm[0]))

        distance = sum(distances)
        if distance < bestDistance:
            bestPerm = perm
            bestDistance = distance
            bestDistances = distances

    bestPerm = list(bestPerm)
    i = rotate_list_by_element(places[0], bestPerm)
    rotate_list_by_index(i, bestDistances)
    return bestPerm, bestDistances


def nearest_neighbor_solve(places: List[str], routeMatrix: List[List[int]]) -> List[str]:
    """Suboptimal greedy solution."""
    unvisited = set(places)
    current = places[0]
    unvisited.remove(current)
    tour = [current]
    distances = []
    while unvisited:
        next_place = min(unvisited, key=lambda place: routeMatrix[places.index(current)][places.index(place)])
        tour.append(next_place)
        distances.append(get_distance(places, routeMatrix, tour[-2], tour[-1]))
        unvisited.remove(next_place)
        current = next_place
    distances.append(get_distance(places, routeMatrix, tour[-1], tour[-0]))    
    return tour, distances
