'use strict'
import React, {Component} from 'react'
import Modal from '../AddOn/Html/Modal.jsx'
import Form from './Form.jsx'

/* global $, openStatus, slide, showId */

export default class Section extends Component {
  constructor(props) {
    super(props)
    this.state = {showForm:false}
    this.initializeSectionLink()
    this.showForm = this.showForm.bind(this)
    this.hideForm = this.hideForm.bind(this)
  }

  initializeSectionLink() {
    $('#add-section').click(function () {
      this.showForm()
    }.bind(this))
  }

  sectionSaved() {
    window.location.href = './slideshow/Show/' + showId
  }

  showForm() {
    this.setState({showForm: true})
    openStatus = false
    slide()
  }

  hideForm() {
    this.setState({showForm: false})
  }

  render() {
    return (
      <div><Modal isOpen={this.state.showForm} close={this.hideForm}><Form success={this.sectionSaved}/></Modal></div>
    )
  }
}
