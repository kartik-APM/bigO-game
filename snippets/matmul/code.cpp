vector<vector<long long>> matmul(const vector<vector<long long>>& A,
                                 const vector<vector<long long>>& B) {
    size_t n = A.size();
    vector<vector<long long>> C(n, vector<long long>(n, 0));
    for (size_t i = 0; i < n; i++)
        for (size_t j = 0; j < n; j++)
            for (size_t k = 0; k < n; k++)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}
