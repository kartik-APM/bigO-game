def prefix_sums(nums):
    out = [0] * (len(nums) + 1)
    for i, x in enumerate(nums):
        out[i + 1] = out[i] + x
    return out
