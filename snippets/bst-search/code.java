boolean contains(Node node, int key) {
    // the tree is kept balanced
    while (node != null) {
        if (key == node.key) return true;
        node = key < node.key ? node.left : node.right;
    }
    return false;
}
