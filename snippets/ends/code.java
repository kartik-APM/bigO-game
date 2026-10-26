int[] ends(int[] items) {
    if (items.length == 0) return null;
    return new int[] { items[0], items[items.length - 1] };
}
