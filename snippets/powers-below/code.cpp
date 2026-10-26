vector<long long> powersBelow(long long n) {
    vector<long long> out;
    for (long long p = 1; p < n; p *= 2) out.push_back(p);
    return out;
}
