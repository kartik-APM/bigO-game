List<int[]> mergeIntervals(int[][] intervals) {
    int[][] sorted = intervals.clone();
    Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> out = new ArrayList<>();
    for (int[] iv : sorted) {
        int[] last = out.isEmpty() ? null : out.get(out.size() - 1);
        if (last != null && iv[0] <= last[1]) last[1] = Math.max(last[1], iv[1]);
        else out.add(new int[] { iv[0], iv[1] });
    }
    return out;
}
