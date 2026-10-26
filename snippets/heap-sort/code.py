import heapq

def heap_sorted(nums):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
    return [heapq.heappop(heap) for _ in range(len(heap))]
