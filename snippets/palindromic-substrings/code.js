function countPalindromes(s) {
  let count = 0;
  for (let center = 0; center < 2 * s.length - 1; center++) {
    let lo = center >> 1;
    let hi = lo + (center % 2);
    while (lo >= 0 && hi < s.length && s[lo] === s[hi]) {
      count++;
      lo--;
      hi++;
    }
  }
  return count;
}
