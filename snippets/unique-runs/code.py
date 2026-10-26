def unique_runs(sorted_nums):
    runs = 0
    i = 0
    while i < len(sorted_nums):
        j = i
        while j < len(sorted_nums) and sorted_nums[j] == sorted_nums[i]:
            j += 1
        runs += 1
        i = j
    return runs
