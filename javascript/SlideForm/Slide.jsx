'use strict'
import React from 'react'
import Abstract from '../AddOn/Mixin/Abstract.jsx'
import Modal from '../AddOn/Html/Modal.jsx'
import Listing from './Listing.jsx'
import Form from './Form.jsx'
import SlideObj from '../Resources/Slide.js'
import Waiting from '../AddOn/Html/Waiting.jsx'

/* global $, openStatus, slide, sectionId */

export default class Slide extends Abstract {
  constructor(props) {
    super(props)
    this.resourceName = 'Slide'
    this.currentSlideId = 0
    SlideObj.sectionId = sectionId
    this.state = {
      showForm: false,
      resource: SlideObj,
      loading: true,
      listing: [],
      errors: {
        delay: null,
        title: null,
      },
    }
    this.initializeSlideLink()
    this.load = this.load.bind(this)
    this.showForm = this.showForm.bind(this)
    this.hideForm = this.hideForm.bind(this)
    this.editForm = this.editForm.bind(this)
    this.deleteConfirm = this.deleteConfirm.bind(this)
    this.updateListing = this.updateListing.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  load() {
    this.setState({loading: true})
    $.getJSON('./slideshow/Slide', {sectionId}).done(function (data) {
      this.setState({loading: false, listing: data,})
    }.bind(this))
  }

  initializeSlideLink() {
    $('#add-slide').click(function () {
      this.showForm()
    }.bind(this))
  }

  deleteConfirm(slideId) {
    if (confirm('Are you sure you want to delete this slide?')) {
      this.deleteSlide(slideId)
    }
  }

  deleteSlide(slideKey) {
    const slide = this.state.listing[slideKey]

    $.ajax({
      url: 'slideshow/Slide/' + slide.id,
      dataType: 'json',
      type: 'delete',
      success: function () {
        let listing = this.state.listing
        listing.splice(slideKey, 1)
        this.setState({listing: listing})
      }.bind(this),
      error: function () {}.bind(this)
    })
  }

  editForm(key) {
    this.setState({showForm : true, resource: this.state.listing[key]})
  }

  showForm() {
    $.ajax({
      url: 'slideshow/Slide',
      data: {
        sectionId: this.state.resource.sectionId
      },
      dataType: 'json',
      type: 'post',
      success: function (data) {
        let slide = SlideObj
        slide.id = data.slideId
        this.setState({showForm: true, resource: slide,})
        this.toggleNavbar(false)
      }.bind(this),
      error: function () {}.bind(this),
    })
  }

  toggleNavbar(status) {
    openStatus = status
    slide()
  }

  hideForm() {
    this.setState({showForm: false})
    this.load()
  }

  updateListing(listing) {
    this.setState({listing : listing})
  }

  render() {
    let listing = <Waiting/>
    if (this.state.loading === false) {
      listing = <Listing
        load={this.load}
        listing={this.state.listing}
        sectionId={sectionId}
        updateListing={this.updateListing}
        delete={this.deleteConfirm}
        edit={this.editForm}/>
    }
    return (
      <div>
        {listing}
        <Modal
          isOpen={this.state.showForm}
          close={this.hideForm}
          width="90%"
          height="90%">
          <div>
            <Form
              patchValue={this.patchValue}
              slide={this.state.resource}
              sectionId={sectionId}
              setValue={this.setValue}
              save={this.save}/>
            <hr/>
            <div className="text-center">
              <button className="btn btn-primary" onClick={this.hideForm}>Close</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
