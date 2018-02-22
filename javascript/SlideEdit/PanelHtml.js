'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const PanelHtml = ({content}) => {
  let panelContent
  
  if (content.length == 0) {
    panelContent = <p>Click to edit</p>
  } else {
    panelContent = content
  }
  
  return (
    <div className="panel-html-view">{panelContent}</div>
  )
}

PanelHtml.propTypes = {}

PanelHtml.defaultProps = {}

export default PanelHtml
