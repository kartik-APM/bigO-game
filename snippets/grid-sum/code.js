function brightness(image) {
  // image is n × n pixels
  let total = 0;
  for (const row of image) {
    for (const px of row) total += px;
  }
  return total;
}
