'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import BooleanButton from '../AddOn/Form/BooleanButton'

const ShowRow = ({
  title,
  active,
  id,
  deletePrompt,
  editForm,
  toggleActive,
}) => {
  return (
    <tr>
      <td className="action">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            Action
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="pointer" onClick={editForm}>
                <i className="fa fa-edit"></i>&nbsp;Edit</a>
            </li>
            <li>
              <a href={`./slideshow/Slide/list/${id}`}>
                <i className="fa fa-film"></i>&nbsp;Slides</a>
            </li>
            <li role="separator" className="divider"></li>
            <li>
              <a className="pointer" onClick={deletePrompt}>
                <i className="fa fa-trash-o"></i>&nbsp;Delete</a>
            </li>
          </ul>
        </div>
      </td>
      <td className="active"><BooleanButton value={active} label={['Not active', 'Active']} handleClick={toggleActive}/></td>
      <td>{title}</td>
      <td>Slides</td>
    </tr>
  )
}
ShowRow.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  active: PropTypes.string,
  deletePrompt: PropTypes.func,
  editForm: PropTypes.func,
  toggleActive : PropTypes.func,
}

export default ShowRow
