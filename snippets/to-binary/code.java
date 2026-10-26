String toBinary(int n) {
    if (n == 0) return "0";
    StringBuilder bits = new StringBuilder();
    while (n > 0) {
        bits.append(n & 1);
        n >>= 1;
    }
    return bits.reverse().toString();
}
