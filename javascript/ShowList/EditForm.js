'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import InputField from '../AddOn/Form/InputField'

const EditForm = ({show, update, save, close,}) => {
  return (
    <div>
      <InputField
        name="title"
        value={show.title}
        change={update.bind(null, 'title')}
        placeholder="Enter Show title"/>
      <button
        className="btn btn-primary btn-block"
        disabled={show.title.length < 4}
        onClick={save}>Save</button>
      <button className="btn btn-danger btn-block" onClick={close}>Cancel</button>
    </div>
  )
}

EditForm.propTypes = {
  show: PropTypes.object,
  update: PropTypes.func,
  save: PropTypes.func,
  close: PropTypes.func,
}

export default EditForm
