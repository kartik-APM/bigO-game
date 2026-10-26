long factorial(int n) {
    long result = 1;
    for (int k = 2; k <= n; k++) result *= k;
    return result;
}
