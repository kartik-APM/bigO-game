unordered_map<string, int> frequencies(const vector<string>& words) {
    unordered_map<string, int> counts;
    for (const auto& w : words) counts[w]++;
    return counts;
}
