const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1],
              [0, 1], [1, -1], [1, 0], [1, 1]];

function liveNeighbours(grid, r, c) {
  let count = 0;
  for (const [dr, dc] of DIRS) {
    const rr = r + dr, cc = c + dc;
    if (rr >= 0 && rr < grid.length && cc >= 0 && cc < grid[0].length) {
      count += grid[rr][cc];
    }
  }
  return count;
}
