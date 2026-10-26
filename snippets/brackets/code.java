boolean balanced(String s) {
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
    Deque<Character> stack = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        if (ch == '(' || ch == '[' || ch == '{') stack.push(ch);
        else if (pairs.containsKey(ch)) {
            if (stack.isEmpty() || !stack.pop().equals(pairs.get(ch))) return false;
        }
    }
    return stack.isEmpty();
}
