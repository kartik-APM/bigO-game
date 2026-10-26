long long inversions(const vector<int>& a) {
    long long count = 0;
    for (size_t i = 0; i < a.size(); i++) {
        for (size_t j = i + 1; j < a.size(); j++) {
            if (a[i] > a[j]) count++;
        }
    }
    return count;
}
