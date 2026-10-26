const int DIRS[8][2] = {{-1, -1}, {-1, 0}, {-1, 1}, {0, -1},
                        {0, 1}, {1, -1}, {1, 0}, {1, 1}};

int liveNeighbours(const vector<vector<int>>& grid, int r, int c) {
    int count = 0;
    for (const auto& d : DIRS) {
        int rr = r + d[0], cc = c + d[1];
        if (rr >= 0 && rr < (int)grid.size() && cc >= 0 && cc < (int)grid[0].size()) {
            count += grid[rr][cc];
        }
    }
    return count;
}
