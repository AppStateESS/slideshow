'use strict'
import React, {Component} from 'react'

export default class Abstract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resource: {},
      errors: {}
    }
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
