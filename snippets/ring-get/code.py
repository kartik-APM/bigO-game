def ring_get(buffer, head, k):
    return buffer[(head + k) % len(buffer)]
