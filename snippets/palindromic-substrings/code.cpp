int countPalindromes(const string& s) {
    int n = s.size(), count = 0;
    for (int center = 0; center < 2 * n - 1; center++) {
        int lo = center / 2;
        int hi = lo + center % 2;
        while (lo >= 0 && hi < n && s[lo] == s[hi]) {
            count++;
            lo--;
            hi++;
        }
    }
    return count;
}
