'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Viewspace from './Viewspace.jsx'

export default class PresentView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content: props.content,
      currentSlide: props.currentSlide
    }

  }

  render() {
    let viewspace = this.props.content.map(function(content) {
        return(
          <Viewspace key={content.id + this.props.currentSlide} content={content} />)
      }.bind(this));

    return (
      <div>
        <div className="jumbotron">
          {viewspace}
        </div>
      </div>
    )
  }
}

PresentView.propTypes = {
  content: PropTypes.array,
  currentSlide: PropTypes.number
}
