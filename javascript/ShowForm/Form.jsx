'use strict'
import React from 'react'
import InputField from '../AddOn/Form/InputField.jsx'
import Show from '../Resources/Show.js'
import Abstract from '../AddOn/Mixin/Abstract.jsx'
import PropTypes from 'prop-types'

/* global $ */

export default class ShowForm extends Abstract {
  constructor(props) {
    super(props)
    this.state = {
      resource: Show,
      errors: {title: false}
    }
    this.save = this.save.bind(this)
  }

  save() {
    $.ajax({
      url: './slideshow/Show',
      data : this.state.resource,
      dataType: 'json',
      type: 'post',
      success: function () {
        this.props.success()
      }.bind(this),
      error: function () {}.bind(this),
    })
  }

  render() {
    return (
      <div>
        <InputField
          name="title"
          label="Title of show"
          value={this.state.resource.title}
          change={this.setValue.bind(this, 'title')}/>
        <button className="btn btn-primary" onClick={this.save} disabled={this.state.resource.title.length === 0}>Save</button>
      </div>
    )
  }
}

ShowForm.propTypes = {
  success: PropTypes.func.isRequired
}
