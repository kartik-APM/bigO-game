vector<int> mergeSort(const vector<int>& a) {
    if (a.size() <= 1) return a;
    size_t mid = a.size() / 2;
    vector<int> left = mergeSort(vector<int>(a.begin(), a.begin() + mid));
    vector<int> right = mergeSort(vector<int>(a.begin() + mid, a.end()));
    vector<int> out;
    size_t i = 0, j = 0;
    while (i < left.size() && j < right.size())
        out.push_back(left[i] <= right[j] ? left[i++] : right[j++]);
    while (i < left.size()) out.push_back(left[i++]);
    while (j < right.size()) out.push_back(right[j++]);
    return out;
}
