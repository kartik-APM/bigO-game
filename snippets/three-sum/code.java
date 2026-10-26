boolean hasZeroTriple(int[] nums) {
    int[] s = nums.clone();
    Arrays.sort(s);
    for (int i = 0; i < s.length - 2; i++) {
        int lo = i + 1, hi = s.length - 1;
        while (lo < hi) {
            int total = s[i] + s[lo] + s[hi];
            if (total == 0) return true;
            if (total < 0) lo++;
            else hi--;
        }
    }
    return false;
}
