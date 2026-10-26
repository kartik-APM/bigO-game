String longestPalindrome(String s) {
    String best = "";
    for (int i = 0; i < s.length(); i++) {
        for (int j = i + 1; j <= s.length(); j++) {
            String sub = s.substring(i, j);
            boolean pal = new StringBuilder(sub).reverse().toString().equals(sub);
            if (pal && sub.length() > best.length()) best = sub;
        }
    }
    return best;
}
