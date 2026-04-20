const fs=require('fs');
const path=require('path');
const file=path.join(__dirname,'../data/presets.json');

function loadPresets(){
  if(!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function savePreset(name,crop){
  let p=loadPresets().filter(x=>x.name!==name);
  p.push({name,crop});
  fs.writeFileSync(file,JSON.stringify(p,null,2));
  return p;
}

function deletePreset(name){
  let p=loadPresets().filter(x=>x.name!==name);
  fs.writeFileSync(file,JSON.stringify(p,null,2));
  return p;
}

module.exports={loadPresets,savePreset,deletePreset};
