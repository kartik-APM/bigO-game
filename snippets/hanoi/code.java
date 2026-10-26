void hanoi(int n, int src, int dst, int via, List<int[]> moves) {
    if (n == 0) return;
    hanoi(n - 1, src, via, dst, moves);
    moves.add(new int[] { src, dst });
    hanoi(n - 1, via, dst, src, moves);
}
