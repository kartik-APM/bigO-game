int pushAndPeek(vector<int>& stack, int value) {
    stack.push_back(value);
    return stack.back();
}
