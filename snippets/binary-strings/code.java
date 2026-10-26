void binaryStrings(int n, String prefix, List<String> out) {
    if (prefix.length() == n) {
        out.add(prefix);
        return;
    }
    binaryStrings(n, prefix + "0", out);
    binaryStrings(n, prefix + "1", out);
}
