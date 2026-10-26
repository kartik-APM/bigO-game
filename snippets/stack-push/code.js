function pushAndPeek(stack, value) {
  stack.push(value);
  return stack[stack.length - 1];
}
