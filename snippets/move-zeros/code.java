void moveZeros(int[] nums) {
    int write = 0;
    for (int x : nums) if (x != 0) nums[write++] = x;
    for (int i = write; i < nums.length; i++) nums[i] = 0;
}
