vector<vector<int>> permutations(const vector<int>& items) {
    if (items.size() <= 1) return {items};
    vector<vector<int>> out;
    for (size_t i = 0; i < items.size(); i++) {
        vector<int> rest = items;
        rest.erase(rest.begin() + i);
        for (auto& p : permutations(rest)) {
            p.insert(p.begin(), items[i]);
            out.push_back(p);
        }
    }
    return out;
}
