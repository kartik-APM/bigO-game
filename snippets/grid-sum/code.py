def brightness(image):
    # image is n × n pixels
    total = 0
    for row in image:
        for px in row:
            total += px
    return total
