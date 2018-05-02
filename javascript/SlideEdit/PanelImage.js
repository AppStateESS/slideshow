'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'

const PanelImage = ({directory, update, remove,}) => {
  let photo = <div>
    <i className="empty-image fa fa-camera fa-5x"></i>
  </div>

  if (directory.length) {
    photo = <img src={directory} className="img-fluid center-block"/>
  }
  let panelContent = (
    <Dropzone onDrop={update} className="dropzone text-center pointer">
      {photo}
    </Dropzone>
  )
  return (
    <div className="panel-view panel-image">
      <button onClick={remove} className="delete-panel btn btn-danger btn-xs">
        <i className="fa fa-times"></i>
      </button>
      {panelContent}
    </div>
  )
}

PanelImage.propTypes = {
  directory: PropTypes.string,
  update: PropTypes.func,
  remove: PropTypes.func
}

PanelImage.defaultProps = {}

export default PanelImage
