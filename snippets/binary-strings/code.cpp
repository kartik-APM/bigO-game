void binaryStrings(int n, const string& prefix, vector<string>& out) {
    if ((int)prefix.size() == n) {
        out.push_back(prefix);
        return;
    }
    binaryStrings(n, prefix + "0", out);
    binaryStrings(n, prefix + "1", out);
}
