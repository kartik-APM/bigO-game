vector<int> nextGreater(const vector<int>& nums) {
    vector<int> result(nums.size(), -1);
    vector<int> st;
    for (int i = 0; i < (int)nums.size(); i++) {
        while (!st.empty() && nums[st.back()] < nums[i]) {
            result[st.back()] = nums[i];
            st.pop_back();
        }
        st.push_back(i);
    }
    return result;
}
