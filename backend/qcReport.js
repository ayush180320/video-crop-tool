function generateQC(meta,crop){
  const w=meta.width-crop.left-crop.right;
  const h=meta.height-crop.top-crop.bottom;

  return {
    output:{width:w,height:h},
    checks:{
      even:
        crop.top%2===0 &&
        crop.bottom%2===0 &&
        crop.left%2===0 &&
        crop.right%2===0
    },
    time:new Date().toISOString()
  };
}

module.exports={generateQC};
