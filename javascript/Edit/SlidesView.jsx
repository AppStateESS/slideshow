'use strict'
import React, { Component } from 'react'
import ButtonGroup from 'canopy-react-buttongroup'
import PropTypes from 'prop-types'

export default class SlidesView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSlide: this.props.currentSlide
    }
    this.handleSlide = this.handleSlide.bind(this)
    this.handleNewSlide = this.handleNewSlide.bind(this)
  }

  handleSlide(event) {
    this.props.setCurrentSlide(event.target.value - 1)
  }

  handleNewSlide() {
    this.props.addNewSlide()
    this.props.setCurrentSlide(this.props.currentSlide + 1)
  }

  render() {
    let slideCount = 0
    let data = this.props.slides.map(function(slide) {
      slideCount += 1
      let bClass = (this.props.currentSlide + 1 == slideCount) ? "btn btn-outline-secondary active" : "btn btn-outline-secondary"
      return(
        <button type="button" className={bClass} key={slideCount} onClick={this.handleSlide} value={slideCount}>Slide {slideCount}</button>
      )
    }.bind(this));

    return (
      <div className="col-3">
        <p></p>
        <div className="btn-group-vertical">
          {data}
          <button type="button" className="btn btn-primary" onClick={this.handleNewSlide}><span><i className="fas fa-plus-circle"></i>&nbsp; New Slide</span></button>
        </div>
      </div>
    )
  }

}

SlidesView.propTypes = {
  currentSlide: PropTypes.number,
  setCurrentSlide: PropTypes.func
}
