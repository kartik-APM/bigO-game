function binaryStrings(n, prefix = "", out = []) {
  if (prefix.length === n) out.push(prefix);
  else {
    binaryStrings(n, prefix + "0", out);
    binaryStrings(n, prefix + "1", out);
  }
  return out;
}
