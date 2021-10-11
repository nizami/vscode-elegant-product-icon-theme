const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

const plugins = [
  'removeDoctype',
  'removeXMLProcInst',
  'removeComments',
  'removeMetadata',
  'removeEditorsNSData',
  'cleanupAttrs',
  'mergeStyles',
  'inlineStyles',
  'minifyStyles',
  'cleanupIDs',
  'removeUselessDefs',
  'cleanupNumericValues',
  'convertColors',
  'removeUnknownsAndDefaults',
  'removeNonInheritableGroupAttrs',
  'removeUselessStrokeAndFill',
  'removeViewBox',
  'cleanupEnableBackground',
  'removeHiddenElems',
  'removeEmptyText',
  'convertShapeToPath',
  'convertEllipseToCircle',
  'moveElemsAttrsToGroup',
  'moveGroupAttrsToElems',
  'collapseGroups',
  'convertPathData',
  'convertTransform',
  'removeEmptyAttrs',
  'removeEmptyContainers',
  'mergePaths',
  'removeUnusedNS',
  'sortDefsChildren',
  'removeTitle',
  'removeDesc',
  'convertStyleToAttrs',
  'cleanupListOfValues',
  'sortAttrs',
  'removeDimensions',
  'removeStyleElement',
  'removeScriptElement',
  'reusePaths',
  { name: 'removeAttrs', params: { attrs: '(stroke|fill|data-name)' } },
];

module.exports = function optimizeIcons() {
  const iconsPath = path.resolve(__dirname, '../icons');
  const files = fs.readdirSync(iconsPath);
  files.forEach(function (file) {
    file = path.resolve(iconsPath, file);
    if (!file.endsWith('.svg')) return;
    console.log(file);
    const data = fs.readFileSync(file, 'utf8');
    const result = optimize(data, { plugins, path: file });

    fs.writeFileSync(
      path.resolve(iconsPath, path.basename(file)),
      result.data,
      { encoding: 'utf8' }
    );
  });
};
