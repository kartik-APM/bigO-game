Map<String, Integer> frequencies(List<String> words) {
    Map<String, Integer> counts = new HashMap<>();
    for (String w : words) counts.merge(w, 1, Integer::sum);
    return counts;
}
