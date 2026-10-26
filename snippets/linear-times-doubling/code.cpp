long long countSteps(int n) {
    long long count = 0;
    for (int i = 0; i < n; i++) {
        for (long long j = 1; j < n; j *= 2) count++;
    }
    return count;
}
