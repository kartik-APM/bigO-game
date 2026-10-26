def count_subsets(nums, target, i=0):
    if i == len(nums):
        return 1 if target == 0 else 0
    take = count_subsets(nums, target - nums[i], i + 1)
    skip = count_subsets(nums, target, i + 1)
    return take + skip
