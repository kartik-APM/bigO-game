function anagrams(word) {
  const out = [];
  const used = new Array(word.length).fill(false);
  const build = (prefix) => {
    if (prefix.length === word.length) {
      out.push(prefix);
      return;
    }
    for (let i = 0; i < word.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      build(prefix + word[i]);
      used[i] = false;
    }
  };
  build("");
  return out;
}
