int countEqualPairs(int[] xs) {
    int count = 0;
    for (int i = 0; i < xs.length; i++) {
        for (int j = 0; j < xs.length; j++) {
            if (i != j && xs[i] == xs[j]) count++;
        }
    }
    return count;
}
