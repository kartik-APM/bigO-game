void selectionSort(vector<int>& a) {
    for (size_t i = 0; i < a.size(); i++) {
        size_t smallest = i;
        for (size_t j = i + 1; j < a.size(); j++) {
            if (a[j] < a[smallest]) smallest = j;
        }
        swap(a[i], a[smallest]);
    }
}
