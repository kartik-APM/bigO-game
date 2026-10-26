int countMax(int[] nums) {
    int best = nums[0];
    for (int x : nums) best = Math.max(best, x);
    int count = 0;
    for (int x : nums) if (x == best) count++;
    return count;
}
