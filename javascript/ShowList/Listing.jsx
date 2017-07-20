'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Listing extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let listing = this.props.list.map(function(value, key){
      return <div key={key}><a href={`./slideshow/Show/${value.id}`}>{value.title}</a></div>
    }.bind(this))

    return (
      <div>{listing}</div>
    )
  }
}

Listing.propTypes = {
  list: PropTypes.array,
}
