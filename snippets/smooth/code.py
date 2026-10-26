def smooth(nums):
    out = []
    for i in range(len(nums)):
        s = 0
        for k in range(-2, 3):
            if 0 <= i + k < len(nums):
                s += nums[i + k]
        out.append(s)
    return out
