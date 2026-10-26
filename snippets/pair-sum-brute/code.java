boolean hasPairSum(int[] xs, int target) {
    for (int i = 0; i < xs.length; i++) {
        for (int j = i + 1; j < xs.length; j++) {
            if (xs[i] + xs[j] == target) return true;
        }
    }
    return false;
}
