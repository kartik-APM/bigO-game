vector<int> heapSorted(const vector<int>& nums) {
    priority_queue<int, vector<int>, greater<int>> heap;
    for (int x : nums) heap.push(x);
    vector<int> out;
    while (!heap.empty()) {
        out.push_back(heap.top());
        heap.pop();
    }
    return out;
}
