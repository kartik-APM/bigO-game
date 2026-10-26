long long pairsBelow(vector<int> nums, int limit) {
    sort(nums.begin(), nums.end());
    int i = 0, j = (int)nums.size() - 1;
    long long count = 0;
    while (i < j) {
        if (nums[i] + nums[j] < limit) {
            count += j - i;
            i++;
        } else {
            j--;
        }
    }
    return count;
}
