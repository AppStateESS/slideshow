'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import PanelHtml from './PanelHtml'

const PageLayout = ({panels}) => {
  let panelContent
  if (panels.length > 0) {
    panelContent = panels.map(function(value, key){
      return (
        <PanelHtml key={key} {...value}/>
      )
    }.bind(this))
  }
  return (
    <div>{panelContent}</div>
  )
}

PageLayout.propTypes = {
  panels: PropTypes.array
}

PageLayout.defaultProps = {}

export default PageLayout
