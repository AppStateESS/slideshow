'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PageLayout from './PageLayout'
//import PanelHtmlObj from '../Resources/PanelHtmlObj'
import PanelImageObj from '../Resources/PanelImageObj'

/* global $ */

export default class SlideEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panels: []
    }
    this.addHtmlPanel = this.addHtmlPanel.bind(this)
    this.addImagePanel = this.addImagePanel.bind(this)
    this.updatePanelHtml = this.updatePanelHtml.bind(this)
    this.updatePanelImage = this.updatePanelImage.bind(this)
    this.removePanel = this.removePanel.bind(this)
  }

  addHtmlPanel() {
    let panels = this.state.panels
    $.ajax({
      url: './slideshow/Panel/',
      data: {
        slideId: this.props.slideId,
        type: 'html',
      },
      dataType: 'json',
      type: 'post',
      success: function (data) {
        panels.push(data.panel)
        this.setState({panels})
      }.bind(this),
      error: function () {}.bind(this),
    })
  }

  addImagePanel() {
    let panels = this.state.panels
    panels.push(new PanelImageObj)
    this.setState({panels})
  }

  updatePanelHtml(key, content) {
    let panels = this.state.panels
    const panel = panels[key]
    panel.content = content
    this.setState({panels})
  }

  updatePanelImage(key, files) {
    const image = files[0]
    let panels = this.state.panels
    const panel = panels[key]
    panel.directory = image.preview
    this.setState({panels})
  }

  removePanel(key) {
    let panels = this.state.panels
    panels.splice(key, 1)
    this.setState({panels})
  }

  render() {
    return (
      <div className="row">
        <div className="panel-select col-sm-2">
          <ul className="panel-list">
            <li className="ss-panel ss-panel-html" onClick={this.addHtmlPanel}>
              <i className="fa fa-code fa-5x"></i>
            </li>
            <li className="ss-panel ss-panel-image" onClick={this.addImagePanel}>
              <i className="fa fa-image fa-5x"></i>
            </li>
            <li className="ss-panel ss-panel-qanda">
              <i className="fa fa-question-circle fa-5x"></i>
            </li>
          </ul>
          <hr/>
          <ul className="panel-list">
            <li className="ss-panel"></li>
          </ul>
        </div>
        <div className="col-sm-10">
          <div className="page-layout">
            <PageLayout
              panels={this.state.panels}
              removePanel={this.removePanel}
              updatePanelHtml={this.updatePanelHtml}
              updatePanelImage={this.updatePanelImage}/>
          </div>
        </div>
      </div>
    )
  }
}

SlideEdit.propTypes = {
  slideId: PropTypes.string
}

SlideEdit.defaultProps = {}
