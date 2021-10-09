const webfont = require('webfont');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function generateFont() {
  try {
    const result = await webfont.webfont({
      files: 'icons/**/*.svg',
      formats: ['woff'],
      startUnicode: 0xe000,
      verbose: true,
      normalize: true,
      sort: false,
      fontName: 'elegant-icons',
    });
    const dest = path.join(__dirname, '..', 'theme', 'elegant-icons.woff');
    fs.writeFileSync(dest, result.woff, 'binary');
    console.log(`Font created at ${dest}`);
    createJson();
  } catch (e) {
    console.error('Font creation failed.', error);
  }
}

function createJson() {
  const gen = glob
    .sync('icons/**/*.svg')
    .map((x) => x.replace('icons/', '').replace('.svg', ''))
    .map((x, i) => ({ name: x, value: i.toString(16).padStart(3, '0') }))
    .map(
      (x) => `    "${x.name}": {
      "fontCharacter": "\\\\e${x.value}"
    }`
    )
    .join(',\n');
  const jsonTemplate = fs
    .readFileSync('build/elegant-product-icon-theme.template.json')
    .toString()
    .replace('"insert": "items"', gen);
  fs.writeFileSync(
    'theme/elegant-product-icon-theme.json',
    jsonTemplate,
    'utf8'
  );
}

generateFont();
