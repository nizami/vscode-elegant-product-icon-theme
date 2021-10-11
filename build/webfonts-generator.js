const glob = require('glob');
const webfontsGenerator = require('webfonts-generator');

webfontsGenerator(
  {
    files: glob.sync('icons/**/*.svg'),
    html: true,
    dest: 'dest/',
  },
  function (error) {
    if (error) {
      console.log('Fail!', error);
    } else {
      console.log('Done!');
    }
  }
);
