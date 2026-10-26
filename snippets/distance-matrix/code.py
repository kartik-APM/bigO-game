def distance_matrix(points):
    n = len(points)
    d = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            dx = points[i][0] - points[j][0]
            dy = points[i][1] - points[j][1]
            d[i][j] = (dx * dx + dy * dy) ** 0.5
    return d
