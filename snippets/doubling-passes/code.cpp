long long weightedPasses(const vector<int>& a) {
    long long work = 0;
    for (size_t width = 1; width < a.size(); width *= 2) {
        for (size_t i = 0; i < a.size(); i++) work += a[i] * (long long)width;
    }
    return work;
}
