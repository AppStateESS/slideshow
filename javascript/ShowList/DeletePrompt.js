'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const DeletePrompt = ({deleteShow, close,}) => {
  return (
    <div>
      <h3>Deleting this Show will remove all associate slides.</h3>
      <p>Are you sure you want to do this?</p>
      <button className="btn btn-danger btn-block" onClick={deleteShow}>Yes, delete it</button>
      <button className="btn btn-outline-dark btn-block" onClick={close}>No, nevermind</button>
    </div>
  )
}

DeletePrompt.propTypes = {
  deleteShow: PropTypes.func,
  close: PropTypes.func
}

DeletePrompt.defaultProps = {}

export default DeletePrompt
