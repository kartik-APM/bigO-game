function ringGet(buffer, head, k) {
  return buffer[(head + k) % buffer.length];
}
