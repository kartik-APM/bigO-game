// MinHeap is a binary heap: push and pop are O(log n)
function heapSorted(nums) {
  const heap = new MinHeap();
  for (const x of nums) heap.push(x);
  const out = [];
  while (heap.size > 0) out.push(heap.pop());
  return out;
}
