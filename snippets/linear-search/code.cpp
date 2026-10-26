int indexOf(const vector<int>& items, int target) {
    for (size_t i = 0; i < items.size(); i++) {
        if (items[i] == target) return i;
    }
    return -1;
}
