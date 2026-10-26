function longestPalindrome(s) {
  let best = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      const sub = s.slice(i, j);
      if (sub === [...sub].reverse().join("") && sub.length > best.length) best = sub;
    }
  }
  return best;
}
