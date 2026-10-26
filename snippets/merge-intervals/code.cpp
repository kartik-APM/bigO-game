vector<pair<int, int>> mergeIntervals(vector<pair<int, int>> intervals) {
    sort(intervals.begin(), intervals.end());
    vector<pair<int, int>> out;
    for (auto [start, finish] : intervals) {
        if (!out.empty() && start <= out.back().second)
            out.back().second = max(out.back().second, finish);
        else
            out.push_back({start, finish});
    }
    return out;
}
