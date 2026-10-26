// permutations(list) returns every ordering of list
int shortestTour(int[][] dist) {
    int n = dist.length;
    List<Integer> others = new ArrayList<>();
    for (int i = 1; i < n; i++) others.add(i);
    int best = Integer.MAX_VALUE;
    for (List<Integer> order : permutations(others)) {
        int cost = 0, at = 0;
        for (int next : order) {
            cost += dist[at][next];
            at = next;
        }
        best = Math.min(best, cost + dist[at][0]);
    }
    return best;
}
