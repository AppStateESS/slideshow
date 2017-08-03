'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {SortableHandle} from 'react-sortable-hoc'

export default class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {slideKey, value, editSlide, deleteSlide, showForm} = this.props
    const DragHandle = SortableHandle(() => DragTag())
    return (
      <li>
        <div>
          <a
            target="_index"
            className="btn btn-success btn-sm"
            href={`./slideshow/Section/watch/${value.sectionId}/${value.id}#/${value.sorting}`}>
            <i className="fa fa-link"></i>
          </a>&nbsp;
          <button
            className="btn btn-primary btn-sm"
            onClick={editSlide.bind(null, slideKey)}>
            <i className="fa fa-edit"></i>
          </button>&nbsp;
          <button
            className="btn btn-danger btn-sm"
            onClick={deleteSlide.bind(null, slideKey)}>
            <i className="fa fa-trash-o"></i>
          </button>&nbsp;
          <DragHandle/>&nbsp;
          <span>Slide {value.sorting}: {value.title}</span>
        </div>
        <hr/>
        <div>
          <button className="btn btn-primary" onClick={showForm}>
            <i className="fa fa-plus"></i>&nbsp;Decision</button>
        </div>
      </li>
    )
  }
}

const DragTag = () => {
  return (
    <div className="drag">
      <i className="fa fa-arrows"></i>
    </div>
  )
}

ListItem.propTypes = {
  slideKey: PropTypes.number,
  value: PropTypes.object,
  editSlide: PropTypes.func,
  deleteSlide: PropTypes.func,
  showForm: PropTypes.func,
}
