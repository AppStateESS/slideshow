'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const DecisionList = ({listing, showForm,}) => {
  if (listing == null || listing[0] == undefined) {
    return null
  }
  let decisions = listing.map(function (value, key) {
    let title = <em>Untitled</em>
    if (value.title && value.title.length > 0) {
      title = value.title
    }
    return (
      <button
        key={key}
        className="btn btn-primary marginRight"
        onClick={showForm.bind(null, key)}>{title}</button>
    )
  })
  return (<div>{decisions}</div>)
}

DecisionList.propTypes = {
  listing: PropTypes.array,
  showForm: PropTypes.func,
}

export default DecisionList
