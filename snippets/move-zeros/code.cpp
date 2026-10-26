void moveZeros(vector<int>& nums) {
    size_t write = 0;
    for (int x : nums) if (x != 0) nums[write++] = x;
    for (size_t i = write; i < nums.size(); i++) nums[i] = 0;
}
