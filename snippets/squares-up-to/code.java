List<Long> squaresUpTo(long n) {
    List<Long> out = new ArrayList<>();
    for (long i = 1; i * i <= n; i++) out.add(i * i);
    return out;
}
