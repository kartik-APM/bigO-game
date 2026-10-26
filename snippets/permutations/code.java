List<List<Integer>> permutations(List<Integer> items) {
    if (items.size() <= 1) return List.of(items);
    List<List<Integer>> out = new ArrayList<>();
    for (int i = 0; i < items.size(); i++) {
        List<Integer> rest = new ArrayList<>(items);
        int first = rest.remove(i);
        for (List<Integer> p : permutations(rest)) {
            List<Integer> next = new ArrayList<>();
            next.add(first);
            next.addAll(p);
            out.add(next);
        }
    }
    return out;
}
