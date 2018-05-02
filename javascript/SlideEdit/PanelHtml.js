'use strict'
import React from 'react'
import PropTypes from 'prop-types'
require('medium-editor/dist/css/medium-editor.css')
require('medium-editor/dist/css/themes/default.css')
import Editor from 'react-medium-editor'

const PanelHtml = ({content, handleChange, remove,}) => {

  const options = {
    buttonLabels: 'fontawesome',
    toolbar: {
      buttons: [
        'bold',
        'italic',
        'fontsize',
        'h2',
        'h3',
        'quote',
        'orderedlist',
        'unorderedlist',
      ]
    },
  }

  const panelContent = (
    <Editor options={options} text={content} onChange={handleChange}/>
  )

  return (
    <div className="panel-view">
      <button onClick={remove} className="delete-panel btn btn-danger btn-xs">
        <i className="fa fa-times"></i>
      </button>
      {panelContent}
    </div>
  )
}

PanelHtml.propTypes = {
  content: PropTypes.string,
  handleChange: PropTypes.func,
}

PanelHtml.defaultProps = {}

export default PanelHtml
