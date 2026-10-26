long weightedPasses(int[] a) {
    long work = 0;
    for (long width = 1; width < a.length; width *= 2) {
        for (int i = 0; i < a.length; i++) work += a[i] * width;
    }
    return work;
}
