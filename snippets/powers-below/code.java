List<Long> powersBelow(long n) {
    List<Long> out = new ArrayList<>();
    for (long p = 1; p < n; p *= 2) out.add(p);
    return out;
}
