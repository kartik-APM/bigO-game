function prefixSum(tree, i) {
  let total = 0;
  while (i > 0) {
    total += tree[i];
    i -= i & -i;
  }
  return total;
}
