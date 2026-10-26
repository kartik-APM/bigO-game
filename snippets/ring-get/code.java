int ringGet(int[] buffer, int head, int k) {
    return buffer[(head + k) % buffer.length];
}
