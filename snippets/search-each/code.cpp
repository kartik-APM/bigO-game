int commonCount(const vector<int>& a, const vector<int>& sortedB) {
    int count = 0;
    for (int x : a) {
        if (binary_search(sortedB.begin(), sortedB.end(), x)) count++;
    }
    return count;
}
