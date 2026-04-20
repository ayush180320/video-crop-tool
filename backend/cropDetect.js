const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

async function detectCrop(filePath) {
  const samples = [5, 15, 30, 60];
  let results = [];

  for (let t of samples) {
    const crop = await runSample(filePath, t);
    if (crop) results.push(crop);
  }

  return stabilize(results);
}

function runSample(file, time) {
  return new Promise((resolve) => {
    let found = null;

    ffmpeg(file)
      .seekInput(time)
      .frames(50)
      .outputOptions('-vf', 'cropdetect=limit=24:round=2:reset=0')
      .output('-f', 'null')
      .on('stderr', (line) => {
        const m = line.match(/crop=\d+:\d+:\d+:\d+/);
        if (m) found = m[0];
      })
      .on('end', () => resolve(found))
      .run();
  });
}

function stabilize(list) {
  const freq = {};
  list.forEach(c => freq[c] = (freq[c] || 0) + 1);

  const best = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0][0];
  const [w,h,x,y] = best.replace('crop=','').split(':').map(Number);

  return { width:w, height:h, x, y };
}

module.exports = { detectCrop };
