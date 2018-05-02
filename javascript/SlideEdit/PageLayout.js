'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import PanelHtml from './PanelHtml'
import PanelImage from './PanelImage'
import PanelHtmlObj from '../Resources/PanelHtmlObj'
import PanelImageObj from '../Resources/PanelImageObj'

const PageLayout = ({panels, updatePanelHtml, updatePanelImage, removePanel,}) => {
  let panelContent
  if (panels.length > 0) {
    panelContent = panels.map(function (value, key) {
      if (value instanceof PanelHtmlObj) {
        return (
          <PanelHtml
            key={key}
            {...value}
            handleChange={(change) => updatePanelHtml(key, change)}
            remove={() => removePanel(key)}/>
        )
      } else if (value instanceof PanelImageObj) {
        return (
          <PanelImage
            key={key}
            {...value}
            update={(change) => updatePanelImage(key, change)}
            remove={() => removePanel(key)}/>
        )
      }
    }.bind(this))
  }
  return (<div>{panelContent}</div>)
}

PageLayout.propTypes = {
  panels: PropTypes.array,
  updatePanel: PropTypes.func,
  removePanel: PropTypes.func
}

PageLayout.defaultProps = {}

export default PageLayout
