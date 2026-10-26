int countPalindromes(String s) {
    int count = 0;
    for (int center = 0; center < 2 * s.length() - 1; center++) {
        int lo = center / 2;
        int hi = lo + center % 2;
        while (lo >= 0 && hi < s.length() && s.charAt(lo) == s.charAt(hi)) {
            count++;
            lo--;
            hi++;
        }
    }
    return count;
}
