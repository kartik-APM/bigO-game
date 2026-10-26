int roomsNeeded(const vector<pair<int, int>>& meetings) {
    vector<int> starts, ends;
    for (auto [s, e] : meetings) {
        starts.push_back(s);
        ends.push_back(e);
    }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    int rooms = 0, best = 0;
    size_t j = 0;
    for (int s : starts) {
        while (j < ends.size() && ends[j] <= s) {
            rooms--;
            j++;
        }
        rooms++;
        best = max(best, rooms);
    }
    return best;
}
