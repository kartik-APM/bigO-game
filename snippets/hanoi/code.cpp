void hanoi(int n, int src, int dst, int via, vector<pair<int, int>>& moves) {
    if (n == 0) return;
    hanoi(n - 1, src, via, dst, moves);
    moves.push_back({src, dst});
    hanoi(n - 1, via, dst, src, moves);
}
