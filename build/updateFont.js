const webfont = require('webfont');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { join } = require('path');
const { defaultIcons } = require('../theme/codicon');

async function generateFont() {
  try {
    const result = await webfont.webfont({
      files: 'icons/**/*.svg',
      formats: ['woff'],
      verbose: true,
      normalize: true,
      sort: false,
      fontName: 'elegant-icons',
      fontHeight: 1000,
      glyphTransformFn: (x) => {
        const hex = defaultIcons[x.name].replace('\\', '');
        x.unicode = [String.fromCharCode(parseInt(hex, 16))];
        return x;
      },
    });
    const dest = path.join(__dirname, '..', 'theme', 'elegant-icons.woff');
    fs.writeFileSync(dest, result.woff, 'binary');
    createJson();
  } catch (e) {
    console.error('Font creation failed.', error);
  }
}

function createJson() {
  const gen = glob
    .sync('icons/**/*.svg')
    .map((x) => x.replace('icons/', '').replace('.svg', ''))
    .map((x, i) => ({ name: x, value: defaultIcons[x].replace('\\', '\\\\') }));

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
    'utf8'
  );
}

generateFont();
