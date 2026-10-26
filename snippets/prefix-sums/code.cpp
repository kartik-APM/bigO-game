vector<long long> prefixSums(const vector<int>& nums) {
    vector<long long> out(nums.size() + 1, 0);
    for (size_t i = 0; i < nums.size(); i++) out[i + 1] = out[i] + nums[i];
    return out;
}
