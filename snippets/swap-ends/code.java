void swapEnds(int[] items) {
    if (items.length > 1) {
        int last = items.length - 1;
        int t = items[0];
        items[0] = items[last];
        items[last] = t;
    }
}
