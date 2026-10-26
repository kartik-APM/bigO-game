string longestPalindrome(const string& s) {
    string best;
    for (size_t i = 0; i < s.size(); i++) {
        for (size_t j = i + 1; j <= s.size(); j++) {
            string sub = s.substr(i, j - i);
            string rev(sub.rbegin(), sub.rend());
            if (sub == rev && sub.size() > best.size()) best = sub;
        }
    }
    return best;
}
