'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Viewspace from './Viewspace.jsx'

export default class PresentView extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className="mh-100">
        <div className="jumbotron" style={{height: 300}}>
          <Viewspace content={this.props.content} />
        </div>
      </div>
    )
  }
}

PresentView.propTypes = {
  content: PropTypes.object,
  currentSlide: PropTypes.number
}
