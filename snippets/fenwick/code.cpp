long long prefixSum(const vector<long long>& tree, int i) {
    long long total = 0;
    while (i > 0) {
        total += tree[i];
        i -= i & -i;
    }
    return total;
}
