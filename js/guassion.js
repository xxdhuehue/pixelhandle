function gaussianMatrix(radius, sigma = radius / 3) {
    const a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    const b = -1 / (2 * sigma ** 2);
    let sum = 0;
    const matrix = [];
    for(let x = -radius; x <= radius; x++) {
      const g = a * Math.exp(b * x ** 2);
      matrix.push(g);
      sum += g;
    }
  
    for(let i = 0, len = matrix.length; i < len; i++) {
      matrix[i] /= sum;
    }
    return {matrix, sum};
  }
  
  function gaussianBlur(pixels, width, height, radius = 3, sigma = radius / 3) {
    const {matrix, sum} = gaussianMatrix(radius, sigma);
    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        let r = 0,
          g = 0,
          b = 0;
  
        for(let j = -radius; j <= radius; j++) {
          const k = x + j;
          if(k >= 0 && k < width) {
            const i = (y * width + k) * 4;
            r += pixels[i] * matrix[j + radius];
            g += pixels[i + 1] * matrix[j + radius];
            b += pixels[i + 2] * matrix[j + radius];
          }
        }
        const i = (y * width + x) * 4;
        pixels[i] = parseInt(r / sum);
        pixels[i + 1] = parseInt(g / sum);
        pixels[i + 2] = parseInt(b / sum);
      }
    }
    return pixels;
  }
  
  let originalPixels = [46,56,17,0,  48,58,15,0,  42,51,16,0,   188,156,79,0,   48,59,20,0,   44,52,13,0,   189,190,120,0];
  const calculatedPixels = gaussianBlur(originalPixels, 7, 1);
  console.log(calculatedPixels)