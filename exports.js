exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  vendor: ['react', 'react-dom'],

  shows: exports.APP_DIR + '/Show/index.jsx',
  edit: exports.APP_DIR + '/Edit/index.jsx',
  present: exports.APP_DIR + '/Present/index.jsx',
  view: exports.APP_DIR + '/View/index.jsx',
  session: exports.APP_DIR + '/Session/index.jsx'
}
