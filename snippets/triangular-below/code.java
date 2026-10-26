List<Long> triangularUpTo(long n) {
    List<Long> out = new ArrayList<>();
    for (long k = 1, t = 1; t <= n; k++, t += k) out.add(t);
    return out;
}
