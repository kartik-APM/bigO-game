static final int[][] DIRS = {{-1, -1}, {-1, 0}, {-1, 1}, {0, -1},
                             {0, 1}, {1, -1}, {1, 0}, {1, 1}};

int liveNeighbours(int[][] grid, int r, int c) {
    int count = 0;
    for (int[] d : DIRS) {
        int rr = r + d[0], cc = c + d[1];
        if (rr >= 0 && rr < grid.length && cc >= 0 && cc < grid[0].length) {
            count += grid[rr][cc];
        }
    }
    return count;
}
