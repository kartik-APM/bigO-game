int place(int row, int n, boolean[] cols, boolean[] d1, boolean[] d2) {
    if (row == n) return 1;
    int total = 0;
    for (int c = 0; c < n; c++) {
        if (cols[c] || d1[row + c] || d2[row - c + n]) continue;
        cols[c] = d1[row + c] = d2[row - c + n] = true;
        total += place(row + 1, n, cols, d1, d2);
        cols[c] = d1[row + c] = d2[row - c + n] = false;
    }
    return total;
}
