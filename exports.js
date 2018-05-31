exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  vendor: ['react', 'react-dom'],

  shows: exports.APP_DIR + '/Show/index.jsx',
  /*SlideEdit: exports.APP_DIR + '/Slide/edit.jsx',
  Present: exports.APP_DIR + '/Show/Present.jsx',
  ShowView: exports.APP_DIR + 'Show/ShowView.jsx',
  ShowCard: exports.APP_DIR + 'Show/ShowCard.jsx'*/

}
