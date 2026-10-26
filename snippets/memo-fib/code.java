Map<Integer, Long> memo = new HashMap<>();

long fib(int n) {
    if (n < 2) return n;
    Long hit = memo.get(n);
    if (hit != null) return hit;
    long v = fib(n - 1) + fib(n - 2);
    memo.put(n, v);
    return v;
}
