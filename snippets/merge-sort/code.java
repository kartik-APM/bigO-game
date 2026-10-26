int[] mergeSort(int[] a) {
    if (a.length <= 1) return a;
    int mid = a.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(a, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(a, mid, a.length));
    int[] out = new int[a.length];
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length)
        out[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.length) out[k++] = left[i++];
    while (j < right.length) out[k++] = right[j++];
    return out;
}
