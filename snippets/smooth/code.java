int[] smooth(int[] nums) {
    int[] out = new int[nums.length];
    for (int i = 0; i < nums.length; i++) {
        for (int k = -2; k <= 2; k++) {
            if (i + k >= 0 && i + k < nums.length) out[i] += nums[i + k];
        }
    }
    return out;
}
