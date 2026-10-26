long maxSubarraySlow(int[] nums) {
    long best = nums[0];
    for (int i = 0; i < nums.length; i++) {
        for (int j = i; j < nums.length; j++) {
            long s = 0;
            for (int k = i; k <= j; k++) s += nums[k];
            best = Math.max(best, s);
        }
    }
    return best;
}
