long brightness(int[][] image) {
    // image is n × n pixels
    long total = 0;
    for (int[] row : image) {
        for (int px : row) total += px;
    }
    return total;
}
