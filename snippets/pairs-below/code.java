long pairsBelow(int[] nums, int limit) {
    int[] s = nums.clone();
    Arrays.sort(s);
    int i = 0, j = s.length - 1;
    long count = 0;
    while (i < j) {
        if (s[i] + s[j] < limit) {
            count += j - i;
            i++;
        } else {
            j--;
        }
    }
    return count;
}
