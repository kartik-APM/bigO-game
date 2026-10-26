vector<int> drain(vector<int>& items) {
    vector<int> order;
    while (!items.empty()) {
        order.push_back(items.front());
        items.erase(items.begin());
    }
    return order;
}
