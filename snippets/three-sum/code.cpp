bool hasZeroTriple(vector<int> nums) {
    sort(nums.begin(), nums.end());
    int n = nums.size();
    for (int i = 0; i < n - 2; i++) {
        int lo = i + 1, hi = n - 1;
        while (lo < hi) {
            int total = nums[i] + nums[lo] + nums[hi];
            if (total == 0) return true;
            if (total < 0) lo++;
            else hi--;
        }
    }
    return false;
}
