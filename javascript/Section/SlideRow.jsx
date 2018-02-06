'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {SortableHandle} from 'react-sortable-hoc'

export default class SlideRow extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {slideKey, value, deleteSlide} = this.props
    const DragHandle = SortableHandle(() => DragTag())
    return (
      <li className="slide">
        <span>Slide {value.sorting}: {value.title}</span>
        <div className="options">
          <a href={`./slideshow/Slide/edit/${value.id}`} className="btn btn-primary">
            <i className="fa fa-edit"></i>
          </a>
          <button className="btn btn-danger" onClick={deleteSlide.bind(null, slideKey)}><i className="fa fa-trash-o"></i></button>
          <DragHandle/>
        </div>
      </li>
    )
  }
}

SlideRow.propTypes = {
  value: PropTypes.object,
  deleteSlide: PropTypes.func,
  slideKey: PropTypes.number,
}

const DragTag = () => {
  return (
    <span className="drag">
      <i className="fa fa-arrows"></i>
    </span>
  )
}
