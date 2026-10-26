void anagrams(const string& word, string& prefix, vector<bool>& used,
              vector<string>& out) {
    if (prefix.size() == word.size()) {
        out.push_back(prefix);
        return;
    }
    for (size_t i = 0; i < word.size(); i++) {
        if (used[i]) continue;
        used[i] = true;
        prefix.push_back(word[i]);
        anagrams(word, prefix, used, out);
        prefix.pop_back();
        used[i] = false;
    }
}
