List<Integer> grayCode(int n) {
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < 1 << n; i++) out.add(i ^ (i >> 1));
    return out;
}
