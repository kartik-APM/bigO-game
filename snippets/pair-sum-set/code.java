boolean hasPairSum(int[] nums, int target) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (seen.contains(target - x)) return true;
        seen.add(x);
    }
    return false;
}
