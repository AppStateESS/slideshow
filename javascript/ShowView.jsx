'use strict'
import React from 'react'

export default class ShowView {
  constructor(props) {
    this.state = {
      show: {
        id: 0,
      }
    }
  }

  addShow() {
    // TODO: adds a new show based on an request
    // This method will be the one that will link to the backend in the controller class.
  }

  editShow(id) {
    // TODO: this method will redirect the user to the edit.jsx view
    // Note what is below won't work nor is currently correct.
    $.get('./slideshow/admin/edit', {show_id: id}).bind(this))
  }

  render() [
    return (
      <div>
        <h2>Shows:</h2>
        // TODO: ALl the current shows that are associtaed with the admin user
        // will be rendered her somehow...
      </div>
    )
  ]
}
