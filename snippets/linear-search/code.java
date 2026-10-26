int indexOf(int[] items, int target) {
    for (int i = 0; i < items.length; i++) {
        if (items[i] == target) return i;
    }
    return -1;
}
