const webfont = require('webfont');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const optimizeIcons = require('./optimize-icons');

async function generateFont() {
  try {
    const result = await webfont.webfont({
      files: 'icons-result/**/*.svg',
      formats: ['woff'],
      verbose: true,
      normalize: true,
      centerHorizontally: true,
      startUnicode: 0xe000,
      sort: true,
      fontName: 'elegant-icons',
      fontHeight: 1000,
    });
    const dest = path.join(__dirname, '..', 'theme', 'elegant-icons.woff');
    fs.writeFileSync(dest, result.woff, 'binary');
    createJson();
  } catch (e) {
    console.error('Font creation failed.', error);
  }
}

function createJson() {
  const svgFiles = glob
    .sync('icons-result/**/*.svg')
    .map((x) => x.replace('icons-result/', '').replace('.svg', ''));

  const gen = svgFiles.map((x, i) => ({
    name: x,
    value: `\\\\e${i.toString(16).padStart(3, '0')}`,
  }));

  iconDefinitions = gen
    .map(
      (x) => `    "${x.name}": {
      "fontCharacter": "${x.value}"
    }`
    )
    .join(',\n');
  const jsonTemplate = fs
    .readFileSync('build/elegant-product-icon-theme.template.json')
    .toString()
    .replace('"insert": "items"', iconDefinitions);
  fs.writeFileSync(
    'theme/elegant-product-icon-theme.json',
    jsonTemplate,
    'utf8'
  );
  fs.writeFileSync(
    'theme/elegant-icons.js',
    `const elegantIcons = {
  ${gen.map((x) => `"${x.name}": "${x.value}"`).join(',\n')}
}`,
    { encoding: 'utf8' }
  );
}

optimizeIcons();
generateFont();
