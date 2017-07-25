'use strict'
import React, {Component} from 'react'
import Modal from '../AddOn/Html/Modal.jsx'
import Form from './Form.jsx'

/* global $, openStatus, slide, sectionId */

export default class Section extends Component {
  constructor(props) {
    super(props)
    this.state = {showForm:false}
    this.initializeSlideLink()
    this.showForm = this.showForm.bind(this)
    this.hideForm = this.hideForm.bind(this)
  }

  initializeSlideLink() {
    $('#add-slide').click(function () {
      this.showForm()
    }.bind(this))
  }

  slideSaved() {
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
      <div><Modal isOpen={this.state.showForm} close={this.hideForm} width="90%" height="90%"><Form success={this.sectionSaved}/></Modal></div>
    )
  }
}
