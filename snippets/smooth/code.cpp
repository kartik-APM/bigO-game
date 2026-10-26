vector<int> smooth(const vector<int>& nums) {
    int n = nums.size();
    vector<int> out(n, 0);
    for (int i = 0; i < n; i++) {
        for (int k = -2; k <= 2; k++) {
            if (i + k >= 0 && i + k < n) out[i] += nums[i + k];
        }
    }
    return out;
}
