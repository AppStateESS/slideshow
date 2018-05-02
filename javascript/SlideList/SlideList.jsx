'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Waiting from '../AddOn/Html/Waiting'
import NewSlide from './NewSlide'

/* global $ */

export default class SlideList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listing: null,
      show: null,
      selectKey: -1
    }
    this.createSlide = this.createSlide.bind(this)
    this.load = this.load.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  resetKey() {
    this.setState({selectKey: -1})
  }

  createSlide() {
    $.ajax({
      url: './slideshow/Slide/',
      data: {
        showId: this.props.showId
      },
      dataType: 'json',
      type: 'post',
      success: function (data) {
        const slideId = data.slideId
        window.location.href = `./slideshow/Slide/${slideId}/edit`
      }.bind(this),
      error: function () {}.bind(this),
    })
  }

  load() {
    $.ajax({
      url: 'slideshow/Slide/list/' + this.props.showId,
      dataType: 'json',
      type: 'get',
      success: function (data) {
        this.setState({listing: data.listing, show: data.show,})
      }.bind(this),
      error: function () {}.bind(this),
    })
  }

  select(selectKey) {
    this.setState({selectKey})
  }

  deleteSlide(e, key) {
    let listing = this.state.listing
    const slide = listing[key]
    if (confirm('Confirm slide deletion?')) {
      $.ajax({
        url: 'slideshow/Slide/' + slide.id,
        dataType: 'json',
        type: 'delete',
        success: function () {
          this.load()
        }.bind(this),
        error: function () {}.bind(this),
      })
    }
  }

  render() {
    if (this.state.listing === null) {
      return <Waiting/>
    }
    let slideList = this.state.listing.map(function (value, key) {
      let slideContent = <span>Slide {value.sorting}</span>
      if (this.state.selectKey == key) {
        slideContent = <span>
          <a className="btn btn-primary" href={`./slideshow/Slide/${value.id}/edit`}>
            <i className="fa fa-edit"></i>
          </a>
          <button className="btn btn-danger" onClick={(e) => this.deleteSlide(e, key)}>
            <i className="far fa-trash-alt"></i>
          </button>
        </span>
      }
      return (
        <div
          key={key}
          className="slide current"
          onMouseEnter={() => this.select(key)}
          onMouseLeave={() => this.resetKey()}>{slideContent}</div>
      )
    }.bind(this))

    return (
      <div>
        {slideList}<NewSlide handleClick={this.createSlide}/>
      </div>
    )
  }
}

SlideList.propTypes = {
  showId: PropTypes.string
}

SlideList.defaultProps = {}
