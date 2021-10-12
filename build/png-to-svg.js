const {trace, Potrace} = require('potrace');
const fs = require('fs');
const glob = require('glob');
const { sync: rimraf } = require('rimraf');

rimraf('icons/**/*.svg');
glob
  .sync('icons-png/**/*.png')
  .forEach((x) =>
    trace(x,{blackOnWhite:false }, (err, svg) => {
      if (err) throw err;
      fs.writeFileSync(
        'icons/' + x.replace('icons-png/', '').replace('.png', '.svg'),
        svg
      );
    })
  );
