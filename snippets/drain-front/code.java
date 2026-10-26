List<Integer> drain(ArrayList<Integer> queue) {
    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) order.add(queue.remove(0));
    return order;
}
