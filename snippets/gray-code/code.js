function grayCode(n) {
  const out = [];
  for (let i = 0; i < 1 << n; i++) out.push(i ^ (i >> 1));
  return out;
}
