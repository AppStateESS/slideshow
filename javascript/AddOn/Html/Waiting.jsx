'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Waiting = ({message, label}) => {
  if (message.length === 0) {
    message = <span>Loading {label}...</span>
  } 
  return (
    <div className="lead text-center">
      <i className="fa fa-cog fa-spin fa-lg"></i>&nbsp;{message}
      </div>
  )
}

Waiting.propTypes = {
  label: PropTypes.string,
  message : PropTypes.string
}

Waiting.defaultProps = {
  message: '',
  label: 'data'
}

export default Waiting
