int countMax(const vector<int>& nums) {
    int best = nums[0];
    for (int x : nums) best = max(best, x);
    int count = 0;
    for (int x : nums) if (x == best) count++;
    return count;
}
