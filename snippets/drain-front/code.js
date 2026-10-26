function drain(queue) {
  const order = [];
  while (queue.length > 0) order.push(queue.splice(0, 1)[0]);
  return order;
}
