def anagrams(word):
    out = []
    used = [False] * len(word)

    def build(prefix):
        if len(prefix) == len(word):
            out.append(prefix)
            return
        for i, ch in enumerate(word):
            if not used[i]:
                used[i] = True
                build(prefix + ch)
                used[i] = False

    build("")
    return out
