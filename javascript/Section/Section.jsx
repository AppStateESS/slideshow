'use strict'
import React, {Component} from 'react'
import Waiting from '../AddOn/Html/Waiting.jsx'
import Listing from './Listing.jsx'

/* global $, sectionId, slide */

export default class Slides extends Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      slides: [],
    }

    this.load = this.load.bind(this)
    this.deleteSlide = this.deleteSlide.bind(this)
  }

  componentDidMount() {
    this.load()
    this.initializeSlideLink()
  }

  initializeSlideLink() {
    $('#add-slide').click(function () {
      const response = this.createSlideAjax()
      response.success(function () {
        this.load()
      }.bind(this))
    }.bind(this))
  }

  load() {
    this.setState({loading: true})
    $.getJSON('./slideshow/Section/' + sectionId).done(function (data) {
      this.setState({loading: false, slides: data,})
    }.bind(this))
  }

  createSlideAjax() {
    return $.ajax({
      url: 'slideshow/Slide',
      data: {
        sectionId: sectionId
      },
      dataType: 'json',
      type: 'post',
    })
  }

  deleteSlide(slideKey) {
    const slide = this.state.slides[slideKey]
    $.ajax({
      url: 'slideshow/Slide/' + slide.id,
      dataType: 'json',
      type: 'delete',
      success: function () {
        this.load()
      }.bind(this),
      error: function () {}.bind(this)
    })
  }

  listSlides() {
    if (this.state.loading) {
      return <Waiting/>
    } else {
      return <Listing slides={this.state.slides} deleteSlide={this.deleteSlide} load={this.load} sectionId={sectionId}/>
    }
  }

  render() {
    return (
      <div>
        {this.listSlides()}
      </div>
    )
  }
}
