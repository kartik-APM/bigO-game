unsigned long long factorial(int n) {
    unsigned long long result = 1;
    for (int k = 2; k <= n; k++) result *= k;
    return result;
}
