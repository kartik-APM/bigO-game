vector<long long> triangularUpTo(long long n) {
    vector<long long> out;
    for (long long k = 1, t = 1; t <= n; k++, t += k) out.push_back(t);
    return out;
}
