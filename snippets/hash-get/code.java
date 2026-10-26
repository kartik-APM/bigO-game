int priceOf(Map<String, Integer> prices, String item) {
    return prices.getOrDefault(item, 0);
}
