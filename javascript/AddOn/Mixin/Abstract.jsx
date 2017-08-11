'use strict'
import React, {Component} from 'react'
import empty from '../Empty.js'

/* global $ */

export default class Abstract extends Component {
  constructor(props) {
    super(props)
    this.resourceName = null
    this.state = {
      resource: {},
      errors: {}
    }
    this.setValue = this.setValue.bind(this)
    this.setError = this.setError.bind(this)
    this.patchValue = this.patchValue.bind(this)
  }

  setValue(varname, value) {
    if (typeof value === 'object' && value.target !== undefined) {
      value = value.target.value
    }
    this.setError(varname, null)
    let resource = this.state.resource
    resource[varname] = value
    this.setState({resource})
  }

  patchValue(varname, updateOnEmpty = true) {
    if (this.resourceName === null) {
      throw 'No resourceName set'
    }
    if (this.state.resource.id === undefined) {
      throw('Resource is missing id')
    }

    const resourceValue = this.state.resource[varname]

    if (!updateOnEmpty && empty(resourceValue)) {
      return
    }

    $.ajax({
      url: `./slideshow/${this.resourceName}/${this.state.resource.id}`,
      data: {
        varname: varname,
        value: resourceValue
      },
      dataType: 'json',
      type: 'patch',
      success: function () {}.bind(this),
      error: function () {}.bind(this)
    })
  }

  setError(varname, value) {
    let errors = this.state.errors
    errors[varname] = value
    this.setState({errors})
  }

  render() {
    return (
      <div></div>
    )
  }
}

Abstract.propTypes = {}
