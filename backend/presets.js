const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../data/presets.json');

function loadPresets() {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function savePreset(name, crop) {
  let presets = loadPresets();
  presets = presets.filter(p => p.name !== name);
  presets.push({ name, crop });
  fs.writeFileSync(file, JSON.stringify(presets, null, 2));
  return presets;
}

function deletePreset(name) {
  let presets = loadPresets().filter(p => p.name !== name);
  fs.writeFileSync(file, JSON.stringify(presets, null, 2));
  return presets;
}

module.exports = { loadPresets, savePreset, deletePreset };
