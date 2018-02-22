'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const NewSlide = ({handleClick}) => {
  return (
    <div className="new-slide text-center" onClick={handleClick}>
      <i className="fa fa-plus fa-5x"></i>
    </div>
  )
}

NewSlide.propTypes = {
  handleClick: PropTypes.func
}

NewSlide.defaultProps = {}

export default NewSlide
