long long go(vector<int>& a, size_t i) {
    if (i == a.size()) return 1;
    long long total = 0;
    for (size_t j = i; j < a.size(); j++) {
        swap(a[i], a[j]);
        if (a[i] != (int)i) total += go(a, i + 1);
        swap(a[i], a[j]);
    }
    return total;
}
