void selectionSort(int[] a) {
    for (int i = 0; i < a.length; i++) {
        int smallest = i;
        for (int j = i + 1; j < a.length; j++) {
            if (a[j] < a[smallest]) smallest = j;
        }
        int t = a[i]; a[i] = a[smallest]; a[smallest] = t;
    }
}
