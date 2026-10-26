DIRS = [(-1, -1), (-1, 0), (-1, 1), (0, -1),
        (0, 1), (1, -1), (1, 0), (1, 1)]

def live_neighbours(grid, r, c):
    count = 0
    for dr, dc in DIRS:
        rr, cc = r + dr, c + dc
        if 0 <= rr < len(grid) and 0 <= cc < len(grid[0]):
            count += grid[rr][cc]
    return count
