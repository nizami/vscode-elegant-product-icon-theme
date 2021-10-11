// require('shelljs/global');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var xml2js = require('xml2js');
var glob = require('glob');
var builder = new xml2js.Builder();
var parseString = xml2js.parseString;
const { execSync } = require('child_process');

var ptToPx = function (pt) {
  return pt * dpi * (1 / 72);
};
var pxToPt = function (px) {
  return px / (dpi * (1 / 72));
};

const opts = {
  width: 32,
  height: 32,
  fit: true,
  output: path.resolve(__dirname, '../resized'),
  format: 'svg',
};

var dpi = 96;
var svgFiles = glob.sync('icons/*.svg');
var finalWidth = pxToPt(opts.width || opts.height);
var finalHeight = pxToPt(opts.height || opts.width);
var finalRatio = finalWidth / finalHeight;

svgFiles.forEach(function (svgPath) {
  if (opts.fit) {
    var origWidth, origHeight;
    var newWidth, newHeight;
    var fileContent = fs.readFileSync(svgPath, 'utf8');

    parseString(fileContent, function (err, parsedFileContent) {
      origWidth = pxToPt(parseInt(parsedFileContent.svg.$.width, 10));
      origHeight = pxToPt(parseInt(parsedFileContent.svg.$.height, 10));
    });

    var origRatio = origWidth / origHeight;

    if (origRatio < finalRatio) {
      newHeight = finalHeight;
      newWidth = origWidth / (origHeight / newHeight);
      newWidth = Math.floor(newWidth);
    } else {
      newWidth = finalWidth;
      newHeight = origHeight / (origWidth / newWidth);
      newHeight = Math.floor(newHeight);
    }

    opts.width = newWidth;
    opts.height = newHeight;
  }

  // build args
  var outputPath = opts.output
    ? path.join(opts.output, path.basename(svgPath, '.svg') + '.' + opts.format)
    : '';

  var args =
    (opts.width ? '-w ' + opts.width : '') +
    (opts.height ? '-h ' + opts.height : '') +
    ` --keep-aspect-ratio --dpi-x 90 --dpi-y 90 -f ${opts.format} ${svgPath}  -o resized/${svgPath}`;
  execSync('rsvg-convert ' + args);

  var resizedFileContent = fs.readFileSync(`resized/${svgPath}`, 'utf8');

  parseString(resizedFileContent, function (err, parsedFileContent) {
    var w = parsedFileContent.svg.$.width;
    var h = parsedFileContent.svg.$.height;

    w = w.match(/pt$/) ? ptToPx(parseInt(w, 10)) + 'px' : w;
    h = h.match(/pt$/) ? ptToPx(parseInt(h, 10)) + 'px' : h;

    parsedFileContent.svg.$.width = w;
    parsedFileContent.svg.$.height = h;
    // parsedFileContent.svg.$.viewBox = [0, 0, parseInt(w, 10), parseInt(h, 10)].join(' ');

    var finalSVG = builder.buildObject(parsedFileContent);
    fs.writeFileSync(outputPath, finalSVG);
  });
});
