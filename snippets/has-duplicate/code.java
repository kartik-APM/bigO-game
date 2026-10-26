boolean hasDuplicate(int[] nums) {
    int[] s = nums.clone();
    Arrays.sort(s);
    for (int i = 1; i < s.length; i++) {
        if (s[i] == s[i - 1]) return true;
    }
    return false;
}
