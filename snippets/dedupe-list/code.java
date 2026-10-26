List<Integer> dedupe(List<Integer> items) {
    List<Integer> out = new ArrayList<>();
    for (int x : items) {
        if (!out.contains(x)) out.add(x);
    }
    return out;
}
