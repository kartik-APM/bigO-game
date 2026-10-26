long long brightness(const vector<vector<int>>& image) {
    // image is n × n pixels
    long long total = 0;
    for (const auto& row : image) {
        for (int px : row) total += px;
    }
    return total;
}
