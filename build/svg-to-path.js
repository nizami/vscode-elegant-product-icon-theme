const fs = require('fs');
const { pathThatSvg } = require('path-that-svg');

fs.readFile('icons/trash.svg', (err, input) => {
    console.log('----', input)
  pathThatSvg(input).then((convertedFromBuffer) => {
    console.log({ convertedFromBuffer });
  });
});
