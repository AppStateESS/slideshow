'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import PageLayout from './PageLayout'
import PanelHtmlObj from '../Resources/PanelHtml'

export default class SlideEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panels: []
    }
    this.addHtmlPanel = this.addHtmlPanel.bind(this)
  }
  
  addHtmlPanel() {
    let panels = this.state.panels
    panels.push(new PanelHtmlObj)
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
            <li className="ss-panel ss-panel-image">
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
            <PageLayout panels={this.state.panels}/>
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
