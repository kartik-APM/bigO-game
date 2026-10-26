void reverseInPlace(vector<int>& items) {
    for (int i = 0, j = (int)items.size() - 1; i < j; i++, j--) {
        swap(items[i], items[j]);
    }
}
