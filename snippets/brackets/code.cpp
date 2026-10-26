bool balanced(const string& s) {
    stack<char> st;
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') {
            st.push(ch);
        } else if (ch == ')' || ch == ']' || ch == '}') {
            char open = ch == ')' ? '(' : ch == ']' ? '[' : '{';
            if (st.empty() || st.top() != open) return false;
            st.pop();
        }
    }
    return st.empty();
}
