List<String> byFrequency(List<String> words) {
    Map<String, Integer> counts = new HashMap<>();
    for (String w : words) counts.merge(w, 1, Integer::sum);
    List<String> keys = new ArrayList<>(counts.keySet());
    keys.sort((a, b) -> counts.get(b) - counts.get(a));
    return keys;
}
