long go(int[] a, int i) {
    if (i == a.length) return 1;
    long total = 0;
    for (int j = i; j < a.length; j++) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
        if (a[i] != i) total += go(a, i + 1);
        t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return total;
}
