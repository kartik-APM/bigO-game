from itertools import permutations

def shortest_tour(dist):
    n = len(dist)
    best = float("inf")
    for order in permutations(range(1, n)):
        route = (0,) + order + (0,)
        cost = sum(dist[route[i]][route[i + 1]] for i in range(n))
        best = min(best, cost)
    return best
