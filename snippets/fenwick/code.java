long prefixSum(long[] tree, int i) {
    long total = 0;
    while (i > 0) {
        total += tree[i];
        i -= i & -i;
    }
    return total;
}
