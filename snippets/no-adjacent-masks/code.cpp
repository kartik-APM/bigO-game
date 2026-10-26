int noAdjacentOnes(int n) {
    int count = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        if ((mask & (mask >> 1)) == 0) count++;
    }
    return count;
}
