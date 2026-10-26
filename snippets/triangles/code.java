int countTriangles(boolean[][] adj) {
    int n = adj.length, count = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (adj[i][j])
                for (int k = j + 1; k < n; k++)
                    if (adj[j][k] && adj[i][k]) count++;
    return count;
}
