int commonCount(int[] a, int[] sortedB) {
    int count = 0;
    for (int x : a) {
        if (Arrays.binarySearch(sortedB, x) >= 0) count++;
    }
    return count;
}
