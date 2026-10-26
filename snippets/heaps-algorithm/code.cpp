void heaps(vector<int>& a, int k, vector<vector<int>>& out) {
    if (k == 1) {
        out.push_back(a);
        return;
    }
    for (int i = 0; i < k - 1; i++) {
        heaps(a, k - 1, out);
        swap(a[k % 2 == 0 ? i : 0], a[k - 1]);
    }
    heaps(a, k - 1, out);
}
