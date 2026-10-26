List<String> staircase(int n) {
    List<String> rows = new ArrayList<>();
    for (int i = 0; i < n; i++) rows.add("#".repeat(i + 1));
    return rows;
}
