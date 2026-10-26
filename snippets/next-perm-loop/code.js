// nextPermutation(a) moves a to the next ordering in O(n)
// and returns false after the last one
function countOrderings(a) {
  a = [...a].sort((x, y) => x - y);
  let count = 1;
  while (nextPermutation(a)) count++;
  return count;
}
