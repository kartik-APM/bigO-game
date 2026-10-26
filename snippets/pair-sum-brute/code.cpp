bool hasPairSum(const vector<int>& xs, int target) {
    for (size_t i = 0; i < xs.size(); i++) {
        for (size_t j = i + 1; j < xs.size(); j++) {
            if (xs[i] + xs[j] == target) return true;
        }
    }
    return false;
}
