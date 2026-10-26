List<List<Integer>> powerSet(List<Integer> items) {
    if (items.isEmpty()) return List.of(List.of());
    List<List<Integer>> rest = powerSet(items.subList(1, items.size()));
    List<List<Integer>> out = new ArrayList<>(rest);
    for (List<Integer> s : rest) {
        List<Integer> with = new ArrayList<>();
        with.add(items.get(0));
        with.addAll(s);
        out.add(with);
    }
    return out;
}
