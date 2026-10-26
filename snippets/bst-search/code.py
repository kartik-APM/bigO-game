def contains(node, key):
    # the tree is kept balanced
    while node is not None:
        if key == node.key:
            return True
        node = node.left if key < node.key else node.right
    return False
