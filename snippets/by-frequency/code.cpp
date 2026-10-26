vector<string> byFrequency(const vector<string>& words) {
    unordered_map<string, int> counts;
    for (const auto& w : words) counts[w]++;
    vector<string> keys;
    for (const auto& entry : counts) keys.push_back(entry.first);
    sort(keys.begin(), keys.end(), [&](const string& a, const string& b) {
        return counts[a] > counts[b];
    });
    return keys;
}
