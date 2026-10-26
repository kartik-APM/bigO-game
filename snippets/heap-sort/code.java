List<Integer> heapSorted(int[] nums) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int x : nums) heap.add(x);
    List<Integer> out = new ArrayList<>();
    while (!heap.isEmpty()) out.add(heap.poll());
    return out;
}
