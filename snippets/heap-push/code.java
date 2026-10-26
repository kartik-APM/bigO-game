void heapPush(List<Integer> heap, int value) {
    heap.add(value);
    int i = heap.size() - 1;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap.get(parent) <= heap.get(i)) break;
        Collections.swap(heap, parent, i);
        i = parent;
    }
}
