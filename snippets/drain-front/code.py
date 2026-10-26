def drain(queue):
    order = []
    while queue:
        order.append(queue.pop(0))
    return order
