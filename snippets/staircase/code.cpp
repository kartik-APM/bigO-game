vector<string> staircase(int n) {
    vector<string> rows;
    for (int i = 0; i < n; i++) rows.push_back(string(i + 1, '#'));
    return rows;
}
