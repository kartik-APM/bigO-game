vector<vector<double>> distanceMatrix(const vector<pair<double, double>>& pts) {
    size_t n = pts.size();
    vector<vector<double>> d(n, vector<double>(n));
    for (size_t i = 0; i < n; i++) {
        for (size_t j = 0; j < n; j++) {
            d[i][j] = hypot(pts[i].first - pts[j].first, pts[i].second - pts[j].second);
        }
    }
    return d;
}
