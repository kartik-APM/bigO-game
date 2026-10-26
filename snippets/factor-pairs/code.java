List<long[]> factorPairs(long n) {
    List<long[]> pairs = new ArrayList<>();
    for (long d = 1; d * d <= n; d++) {
        if (n % d == 0) pairs.add(new long[] { d, n / d });
    }
    return pairs;
}
