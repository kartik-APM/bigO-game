void anagrams(String word, String prefix, boolean[] used, List<String> out) {
    if (prefix.length() == word.length()) {
        out.add(prefix);
        return;
    }
    for (int i = 0; i < word.length(); i++) {
        if (used[i]) continue;
        used[i] = true;
        anagrams(word, prefix + word.charAt(i), used, out);
        used[i] = false;
    }
}
