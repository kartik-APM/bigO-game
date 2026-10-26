string toBinary(unsigned n) {
    if (n == 0) return "0";
    string bits;
    while (n > 0) {
        bits.push_back('0' + (n & 1));
        n >>= 1;
    }
    reverse(bits.begin(), bits.end());
    return bits;
}
