const presetList = document.getElementById('presetList');

async function refreshPresets() {
  const presets = await window.api.getPresets();
  presetList.innerHTML = presets.map(p => `<option>${p.name}</option>`).join('');
}

document.getElementById('savePreset').onclick = async () => {
  const name = prompt("Preset name:");
  if (!name) return;
  await window.api.savePreset(name, crop);
  refreshPresets();
};

document.getElementById('loadPreset').onclick = async () => {
  const presets = await window.api.getPresets();
  const selected = presets.find(p => p.name === presetList.value);
  if (selected) {
    crop = selected.crop;
    draw();
  }
};

document.getElementById('deletePreset').onclick = async () => {
  await window.api.deletePreset(presetList.value);
  refreshPresets();
};

refreshPresets();
