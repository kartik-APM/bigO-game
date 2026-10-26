void heapPush(vector<int>& heap, int value) {
    heap.push_back(value);
    size_t i = heap.size() - 1;
    while (i > 0) {
        size_t parent = (i - 1) / 2;
        if (heap[parent] <= heap[i]) break;
        swap(heap[parent], heap[i]);
        i = parent;
    }
}
