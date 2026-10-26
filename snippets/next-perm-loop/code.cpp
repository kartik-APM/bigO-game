long long countOrderings(vector<int> a) {
    sort(a.begin(), a.end());
    long long count = 0;
    do {
        count++;
    } while (next_permutation(a.begin(), a.end()));  // O(n) per step
    return count;
}
