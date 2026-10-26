long[] prefixSums(int[] nums) {
    long[] out = new long[nums.length + 1];
    for (int i = 0; i < nums.length; i++) out[i + 1] = out[i] + nums[i];
    return out;
}
