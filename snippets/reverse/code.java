void reverse(int[] items) {
    for (int i = 0, j = items.length - 1; i < j; i++, j--) {
        int t = items[i];
        items[i] = items[j];
        items[j] = t;
    }
}
