vector<vector<int>> powerSet(const vector<int>& items, size_t i = 0) {
    if (i == items.size()) return {{}};
    vector<vector<int>> rest = powerSet(items, i + 1);
    vector<vector<int>> out = rest;
    for (auto s : rest) {
        s.insert(s.begin(), items[i]);
        out.push_back(s);
    }
    return out;
}
