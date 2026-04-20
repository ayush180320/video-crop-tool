function generateQC(meta, crop) {
  const width = meta.width - crop.left - crop.right;
  const height = meta.height - crop.top - crop.bottom;

  return {
    output: { width, height },
    checks: {
      evenPixels:
        crop.top%2===0 &&
        crop.bottom%2===0 &&
        crop.left%2===0 &&
        crop.right%2===0
    },
    timestamp: new Date().toISOString()
  };
}

module.exports = { generateQC };
