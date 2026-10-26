int uniqueRuns(const vector<int>& sorted) {
    int runs = 0;
    size_t i = 0;
    while (i < sorted.size()) {
        size_t j = i;
        while (j < sorted.size() && sorted[j] == sorted[i]) j++;
        runs++;
        i = j;
    }
    return runs;
}
