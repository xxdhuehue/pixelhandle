 
export function traverse(imageData, pass) {
  const {width, height, data} = imageData;
  for(let i = 0; i < width * height * 4; i += 4) {
    const [r, g, b, a] = pass({
      r: data[i] / 255,
      g: data[i + 1] / 255,
      b: data[i + 2] / 255,
      a: data[i + 3] / 255,
      index: i,
      width,
      height,
      x: ((i / 4) % width) / width,
      y: Math.floor(i / 4 / width) / height});
    data.set([r, g, b, a].map(v => Math.round(v * 255)), i);
  }
  return imageData;
}


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


export function gaussianBlur(pixels, width, height, radius = 3, sigma = radius / 3) {
  const {matrix, sum} = gaussianMatrix(radius, sigma);
  for(let y = 5; y < height -5; y++) {
    for(let x = 5; x < width -5; x++) {
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
      pixels[i] = r ;
      pixels[i + 1] = g;
      pixels[i + 2] = b ;
    }
  }

  for(let x = 5; x < width -5; x++) {
    for(let y = 5; y < height -5; y++) {
      let r = 0,
        g = 0,
        b = 0;

      for(let j = -radius; j <= radius; j++) {
        const k = y + j;
        if(k >= 0 && k < height) {
          const i = (k * width + x) * 4;
          r += pixels[i] * matrix[j + radius];
          g += pixels[i + 1] * matrix[j + radius];
          b += pixels[i + 2] * matrix[j + radius];
        }
      }
      const i = (y * width + x) * 4;
      pixels[i] = r ;
      pixels[i + 1] = g ;
      pixels[i + 2] = b ;
    }
  }
  return pixels;
}


function dataURLtoBlob(dataUrl) {
  let arr = dataUrl.split(","),
  mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]),
  n = bstr.length,
  u8arr = new Uint8Array(n);
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
function downloadFile(url, name = "photo") {
  let a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", name+(new Date()).getTime());
  a.setAttribute("target", "_blank");
  let clickEvent = document.createEvent("MouseEvents");
  clickEvent.initEvent("click", true, true);
  a.dispatchEvent(clickEvent);
}

export function downloadBase64Img(base64) {
  let myBlob = dataURLtoBlob(base64);
  let myUrl = URL.createObjectURL(myBlob);
  return downloadFile(myUrl);
}