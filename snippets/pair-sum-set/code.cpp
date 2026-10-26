bool hasPairSum(const vector<int>& nums, int target) {
    unordered_set<int> seen;
    for (int x : nums) {
        if (seen.count(target - x)) return true;
        seen.insert(x);
    }
    return false;
}
