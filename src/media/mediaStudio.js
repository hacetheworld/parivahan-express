/**
 * Inline Media Studio Engine for Parivahan Express using HTML5 Canvas API.
 * Provides client-side cropping, contrast boosting, monochrome signature thresholding,
 * and binary-search quality compression strictly targeting portal KB limits (<= 20 KB / <= 10 KB).
 */

/**
 * Load image file into HTMLImageElement
 */
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Calculate approximate byte size of base64 data URL
 */
export function getBase64ByteSize(dataUrl) {
  if (!dataUrl) return 0;
  const base64String = dataUrl.split(',')[1] || '';
  const padding = (base64String.match(/=/g) || []).length;
  return Math.round((base64String.length * 0.75) - padding);
}

/**
 * Apply Contrast and Brightness boost algorithm to ImageData
 */
export function applyContrastBrightness(ctx, width, height, contrastVal = 1.2, brightnessVal = 10) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = (259 * (contrastVal + 255)) / (255 * (259 - contrastVal));

  for (let i = 0; i < data.length; i += 4) {
    // Red, Green, Blue
    data[i] = factor * (data[i] - 128) + 128 + brightnessVal;
    data[i + 1] = factor * (data[i + 1] - 128) + 128 + brightnessVal;
    data[i + 2] = factor * (data[i + 2] - 128) + 128 + brightnessVal;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply High-Contrast Monochrome Threshold filter for Signature photos
 * Turns dim paper backgrounds pure white (#FFFFFF) and ink lines crisp black (#000000)
 */
export function applyMonochromeSignatureFilter(ctx, width, height, threshold = 180) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Luminance grayscale formula
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    if (gray > threshold) {
      // Light background -> Pure White
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      // Dark signature ink -> Sharp Dark Ink
      data[i] = 20;
      data[i + 1] = 30;
      data[i + 2] = 45;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Binary search quality compression algorithm to strictly hit target KB limit
 * Target: <= 20 KB (photo), <= 10 KB (signature)
 */
export function compressCanvasToTargetKb(canvas, targetMaxKb, minQuality = 0.05, maxQuality = 0.95) {
  let low = minQuality;
  let high = maxQuality;
  let bestDataUrl = canvas.toDataURL('image/jpeg', low);
  let bestSizeKb = parseFloat((getBase64ByteSize(bestDataUrl) / 1024).toFixed(1));

  // If even lowest quality exceeds, scale down canvas dimensions iteratively
  if (bestSizeKb > targetMaxKb) {
    const scaledCanvas = document.createElement('canvas');
    const scaleFactor = 0.7;
    scaledCanvas.width = Math.round(canvas.width * scaleFactor);
    scaledCanvas.height = Math.round(canvas.height * scaleFactor);
    const sCtx = scaledCanvas.getContext('2d');
    sCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    return compressCanvasToTargetKb(scaledCanvas, targetMaxKb, minQuality, maxQuality);
  }

  // Binary search for highest quality under targetMaxKb
  for (let iter = 0; iter < 7; iter++) {
    const midQuality = (low + high) / 2;
    const testDataUrl = canvas.toDataURL('image/jpeg', midQuality);
    const testSizeKb = parseFloat((getBase64ByteSize(testDataUrl) / 1024).toFixed(1));

    if (testSizeKb <= targetMaxKb) {
      bestDataUrl = testDataUrl;
      bestSizeKb = testSizeKb;
      low = midQuality; // Try higher quality
    } else {
      high = midQuality; // Reduce quality
    }
  }

  return {
    dataUrl: bestDataUrl,
    sizeKb: bestSizeKb,
    width: canvas.width,
    height: canvas.height
  };
}

/**
 * Process Image Pipeline for Photo or Signature
 */
export async function processDocumentImage({
  imgElement,
  cropX = 0,
  cropY = 0,
  cropWidth,
  cropHeight,
  outputWidth = 400,
  outputHeight = 533, // Default 3:4 for photo
  mode = 'photo', // 'photo' | 'signature'
  targetMaxKb = 20,
  enhanceContrast = false,
  monochromeFilter = false,
  brightness = 10
}) {
  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d');

  // Fill canvas with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, outputWidth, outputHeight);

  // Draw cropped image region
  ctx.drawImage(
    imgElement,
    cropX,
    cropY,
    cropWidth || imgElement.naturalWidth,
    cropHeight || imgElement.naturalHeight,
    0,
    0,
    outputWidth,
    outputHeight
  );

  // Apply photo contrast boost if enabled
  if (enhanceContrast) {
    applyContrastBrightness(ctx, outputWidth, outputHeight, 25, brightness);
  }

  // Apply monochrome signature thresholding if mode is signature or requested
  if (mode === 'signature' || monochromeFilter) {
    applyMonochromeSignatureFilter(ctx, outputWidth, outputHeight, 175);
  }

  // Binary search compress canvas to target KB
  return compressCanvasToTargetKb(canvas, targetMaxKb);
}
