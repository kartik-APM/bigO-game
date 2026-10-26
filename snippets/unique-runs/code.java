int uniqueRuns(int[] sorted) {
    int runs = 0;
    int i = 0;
    while (i < sorted.length) {
        int j = i;
        while (j < sorted.length && sorted[j] == sorted[i]) j++;
        runs++;
        i = j;
    }
    return runs;
}
