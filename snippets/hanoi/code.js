function hanoi(n, src, dst, via, moves) {
  if (n === 0) return;
  hanoi(n - 1, src, via, dst, moves);
  moves.push([src, dst]);
  hanoi(n - 1, via, dst, src, moves);
}
