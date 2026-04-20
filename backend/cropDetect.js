const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

function detectCrop(filePath) {
  return new Promise((resolve, reject) => {
    let crops = [];

    ffmpeg(filePath)
      .outputOptions('-vf', 'cropdetect=limit=24:round=2:reset=0')
      .output('-f', 'null')
      .on('stderr', (line) => {
        const m = line.match(/crop=\d+:\d+:\d+:\d+/);
        if (m) crops.push(m[0]);
      })
      .on('end', () => resolve(aggregate(crops)))
      .on('error', reject)
      .run();
  });
}

function aggregate(list) {
  if (!list.length) return null;

  const parsed = list.map(c => {
    const [w,h,x,y] = c.replace('crop=','').split(':').map(Number);
    return {w,h,x,y};
  });

  const median = arr => arr.sort((a,b)=>a-b)[Math.floor(arr.length/2)];

  return {
    width: median(parsed.map(p=>p.w)),
    height: median(parsed.map(p=>p.h)),
    x: median(parsed.map(p=>p.x)),
    y: median(parsed.map(p=>p.y))
  };
}

module.exports = { detectCrop };
