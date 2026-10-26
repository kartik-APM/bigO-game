int ringGet(const vector<int>& buffer, int head, int k) {
    return buffer[(head + k) % buffer.size()];
}
