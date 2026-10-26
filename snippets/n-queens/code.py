def count_queens(n):
    cols, d1, d2 = set(), set(), set()

    def place(row):
        if row == n:
            return 1
        total = 0
        for c in range(n):
            if c in cols or row + c in d1 or row - c in d2:
                continue
            cols.add(c); d1.add(row + c); d2.add(row - c)
            total += place(row + 1)
            cols.remove(c); d1.remove(row + c); d2.remove(row - c)
        return total

    return place(0)
