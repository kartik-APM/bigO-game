bool isPalindrome(const string& s) {
    for (int i = 0, j = (int)s.size() - 1; i < j; i++, j--) {
        if (s[i] != s[j]) return false;
    }
    return true;
}
