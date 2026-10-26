int priceOf(const unordered_map<string, int>& prices, const string& item) {
    auto it = prices.find(item);
    return it == prices.end() ? 0 : it->second;
}
