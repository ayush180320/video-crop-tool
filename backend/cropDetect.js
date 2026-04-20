const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

async function detectCrop(filePath) {
  const times = [5,15,30,60];
  let results = [];

  for (let t of times) {
    const c = await sample(filePath, t);
    if (c) results.push(c);
  }

  return stabilize(results);
}

function sample(file, t) {
  return new Promise(res=>{
    let found=null;

    ffmpeg(file)
      .seekInput(t)
      .frames(40)
      .outputOptions('-vf','cropdetect=limit=24:round=2:reset=0')
      .output('-f','null')
      .on('stderr', l=>{
        const m=l.match(/crop=\d+:\d+:\d+:\d+/);
        if(m) found=m[0];
      })
      .on('end', ()=>res(found))
      .run();
  });
}

function stabilize(list){
  const freq={};
  list.forEach(c=>freq[c]=(freq[c]||0)+1);
  const best=Object.entries(freq).sort((a,b)=>b[1]-a[1])[0][0];
  const [w,h,x,y]=best.replace('crop=','').split(':').map(Number);
  return {width:w,height:h,x,y};
}

module.exports={detectCrop};
