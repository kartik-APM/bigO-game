// nextPermutation(a) moves a to the next ordering in O(n)
// and returns false after the last one
long countOrderings(int[] a) {
    a = a.clone();
    Arrays.sort(a);
    long count = 1;
    while (nextPermutation(a)) count++;
    return count;
}
