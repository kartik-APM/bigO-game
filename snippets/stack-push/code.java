int pushAndPeek(List<Integer> stack, int value) {
    stack.add(value);
    return stack.get(stack.size() - 1);
}
