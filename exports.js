exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  vendor: ['react', 'react-dom'],
  /*
  ShowList: exports.APP_DIR + '/ShowList/index.jsx',
  SlideList: exports.APP_DIR + '/SlideList/index.jsx',
  SlideEdit: exports.APP_DIR + '/SlideEdit/index.jsx',
  */
}
