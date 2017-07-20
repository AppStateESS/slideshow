'use strict'
import React, {Component} from 'react'
import Modal from '../AddOn/Html/Modal.jsx'
import Form from './Form.jsx'

/* global $, openStatus, slide */

export default class Section extends Component {
  constructor(props) {
    super(props)
    this.state = {showForm:false}
    this.initializeShowLink()
    this.showForm = this.showForm.bind(this)
    this.hideForm = this.hideForm.bind(this)
  }

  initializeShowLink() {
    $('#add-show').click(function () {
      this.showForm()
    }.bind(this))
  }

  showSaved() {
    this.hideForm()
  }

  showForm() {
    this.setState({showForm: true})
    openStatus = false
    slide()
  }

  hideForm() {
    this.setState({showForm: false})
  }

  backToShow() {
    window.location.href = './slideshow/Show/list'
  }

  render() {
    return (
      <div><Modal isOpen={this.state.showForm} close={this.hideForm}><Form success={this.backToShow}/></Modal></div>
    )
  }
}
