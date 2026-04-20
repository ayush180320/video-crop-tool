function generateQC(videoMeta, crop) {
  const width = videoMeta.width - crop.left - crop.right;
  const height = videoMeta.height - crop.top - crop.bottom;

  const aspect = (width / height).toFixed(2);

  return {
    original: videoMeta,
    crop,
    output: {
      width,
      height,
      aspectRatio: aspect
    },
    checks: {
      evenPixels: [
        crop.top % 2 === 0,
        crop.bottom % 2 === 0,
        crop.left % 2 === 0,
        crop.right % 2 === 0
      ].every(Boolean),
      safeAspect: aspect > 1.7 && aspect < 2.5
    },
    timestamp: new Date().toISOString()
  };
}

module.exports = { generateQC };
