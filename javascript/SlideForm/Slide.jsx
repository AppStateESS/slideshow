'use strict'
import React from 'react'
import Abstract from '../AddOn/Mixin/Abstract.jsx'
import Modal from '../AddOn/Html/Modal.jsx'
import Form from './Form.jsx'
import Slide from '../Resources/Slide.js'

/* global $, openStatus, slide, sectionId */

export default class Section extends Abstract {
  constructor(props) {
    super(props)
    this.currentSlideId = 0
    Slide.sectionId = sectionId
    this.state = {
      showForm: false,
      slide: Slide
    }
    this.initializeSlideLink()
    this.showForm = this.showForm.bind(this)
    this.hideForm = this.hideForm.bind(this)
  }

  initializeSlideLink() {
    $('#add-slide').click(function () {
      this.showForm()
    }.bind(this))
  }

  showForm() {
    $.ajax({
      url: 'slideshow/Slide',
      data: {
        sectionId: this.state.slide.sectionId
      },
      dataType: 'json',
      type: 'post',
      success: function (data) {
        let slide = Slide
        slide.id = data.slideId
        this.setState({showForm: true, slide: slide})
        this.toggleNavbar(false)
      }.bind(this),
      error: function () {}.bind(this)
    })
  }

  toggleNavbar(status) {
    openStatus = status
    slide()
  }

  hideForm() {
    if (!this.state.slide.active) {
      $.ajax({
        url: 'slideshow/Slide/' + this.state.slide.id,
        dataType: 'json',
        type: 'delete',
        success: function () {}.bind(this),
        error: function () {}.bind(this),
      })
    }
    this.setState({showForm: false})
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.showForm}
          close={this.hideForm}
          width="90%"
          height="90%"><Form slide={this.state.slide} sectionId={sectionId} setValue={this.setValue}/></Modal>
      </div>
    )
  }
}
