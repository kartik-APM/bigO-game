void heaps(int[] a, int k, List<int[]> out) {
    if (k == 1) {
        out.add(a.clone());
        return;
    }
    for (int i = 0; i < k - 1; i++) {
        heaps(a, k - 1, out);
        int j = k % 2 == 0 ? i : 0;
        int t = a[j]; a[j] = a[k - 1]; a[k - 1] = t;
    }
    heaps(a, k - 1, out);
}
