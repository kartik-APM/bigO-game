int shortestTour(const vector<vector<int>>& dist) {
    int n = dist.size();
    vector<int> order;
    for (int i = 1; i < n; i++) order.push_back(i);
    int best = INT_MAX;
    do {
        int cost = 0, at = 0;
        for (int city : order) {
            cost += dist[at][city];
            at = city;
        }
        best = min(best, cost + dist[at][0]);
    } while (next_permutation(order.begin(), order.end()));
    return best;
}
