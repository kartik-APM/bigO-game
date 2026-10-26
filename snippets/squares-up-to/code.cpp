vector<long long> squaresUpTo(long long n) {
    vector<long long> out;
    for (long long i = 1; i * i <= n; i++) out.push_back(i * i);
    return out;
}
