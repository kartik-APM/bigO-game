def count_triangles(adj):
    n = len(adj)
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            if adj[i][j]:
                for k in range(j + 1, n):
                    if adj[j][k] and adj[i][k]:
                        count += 1
    return count
