'use strict'
import React from 'react'
import InputField from '../AddOn/Form/InputField.jsx'
import Section from '../Resources/Section.js'
import Abstract from '../AddOn/Mixin/Abstract.jsx'
import PropTypes from 'prop-types'

/* global $, showId */

export default class SectionForm extends Abstract {
  constructor(props) {
    super(props)
    Section.showId = showId
    this.state = {
      resource: Section,
      errors: {
        title: false
      },
    }
    this.save = this.save.bind(this)
  }

  save() {
    $.ajax({
      url: './slideshow/Section',
      data: this.state.resource,
      dataType: 'json',
      type: 'post',
      success: function () {
        this.props.success()
      }.bind(this),
      error: function () {}.bind(this)
    })
  }

  render() {
    return (
      <div>
        <form>
          <InputField
            name="title"
            focus={true}
            value={this.state.resource.title}
            label="Section title"
            change={this.setValue.bind(this, 'title')}/>
          <button
            className="btn btn-primary"
            onClick={this.save}
            disabled={this.state.resource.title.length === 0}>Save</button>
        </form>
      </div>
    )
  }
}

SectionForm.propTypes = {
  success: PropTypes.func.isRequired
}
