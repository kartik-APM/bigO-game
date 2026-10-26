def rec_sum(nums, i=0):
    if i == len(nums):
        return 0
    return nums[i] + rec_sum(nums, i + 1)
