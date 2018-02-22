'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const BooleanButton = ({label, value, handleClick,}) => {
  let toggle = value == '1' || value == 1 || value == true

  let buttonClass = 'btn btn-danger'
  let buttonLabel = label[0]
  if (toggle) {
    buttonClass = 'btn btn-success'
    buttonLabel = label[1]
  }
  return (<button className={buttonClass} onClick={handleClick}>{buttonLabel}</button>)
}

BooleanButton.propTypes = {
  handleClick: PropTypes.func,
  value : PropTypes.oneOfType([PropTypes.number,PropTypes.string,PropTypes.bool,]),
  label : PropTypes.array.isRequired,
}

BooleanButton.defaultProps = {}

export default BooleanButton
