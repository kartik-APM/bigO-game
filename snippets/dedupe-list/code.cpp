vector<int> dedupe(const vector<int>& items) {
    vector<int> out;
    for (int x : items) {
        if (find(out.begin(), out.end(), x) == out.end()) out.push_back(x);
    }
    return out;
}
