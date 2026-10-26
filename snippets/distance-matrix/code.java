double[][] distanceMatrix(double[][] points) {
    int n = points.length;
    double[][] d = new double[n][n];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            d[i][j] = Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]);
        }
    }
    return d;
}
