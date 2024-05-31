from typing import List
from itertools import permutations

def get_distance(cities, distances, city1, city2):
    """Helper function to find the distance between two cities given distances array."""
    return distances[cities.index(city1)][cities.index(city2)]


def brute_force_solve(cities: List[str], distances: List[List[int]]) -> List[str]:
    """Brute force solution comparing all permutations of cities. Not recommended for more than 7-8 cities."""
    perms = permutations(cities)
    bestPerm = None
    bestDistance = float('inf')
    for perm in list(perms):
        distance = 0
        for i in range(len(perm) - 1):
            distance += get_distance(cities, distances, perm[i], perm[i + 1])
        if distance < bestDistance:
            bestPerm = perm
            bestDistance = bestDistance
    return bestPerm


def nearest_neighbor_solve(cities: List[str], distances: List[List[int]]) -> List[str]:
    """Suboptimal greedy solution."""
    unvisited = set(cities)
    current = cities[0]
    unvisited.remove(current)
    tour = [current]
    while unvisited:
        next_city = min(unvisited, key=lambda city: distances[cities.index(current)][cities.index(city)])
        tour.append(next_city)
        unvisited.remove(next_city)
        current = next_city
    return tour
