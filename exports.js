exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  vendor: ['react', 'react-dom'],
  showform: exports.APP_DIR + '/ShowForm/index.jsx',
  sectionform: exports.APP_DIR + '/SectionForm/index.jsx',
  Section: exports.APP_DIR + '/Section/index.jsx',
  Slide: exports.APP_DIR + '/Slide/index.jsx',
}
