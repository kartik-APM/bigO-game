pair<int, int> ends(const vector<int>& items) {
    if (items.empty()) return {-1, -1};
    return {items.front(), items.back()};
}
