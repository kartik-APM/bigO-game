int bestValue(const vector<int>& w, const vector<int>& v, int cap, size_t i = 0) {
    if (i == w.size()) return 0;
    int skip = bestValue(w, v, cap, i + 1);
    if (w[i] > cap) return skip;
    int take = v[i] + bestValue(w, v, cap - w[i], i + 1);
    return max(skip, take);
}
