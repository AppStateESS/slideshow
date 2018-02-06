'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import SortableList from './SortableList.jsx'
import './slide.css'

/* global $ */

export default class Listing extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.sortEnd = this.sortEnd.bind(this)
  }

  sortEnd(movement) {
    const {oldIndex, newIndex,} = movement
    const newPosition = this.props.slides[newIndex].sorting
    const movingSlideId = this.props.slides[oldIndex].id
    $.ajax({
      url: './slideshow/Slide/' + movingSlideId + '/move',
      data: {
        sectionId: this.props.sectionId,
        varname: 'move',
        newPosition: newPosition
      },
      success: function () {
        this.props.load()
      }.bind(this),
      dataType: 'json',
      type: 'patch'
    })
  }

  render() {
    return (
      <div className="slide-listing">
        <SortableList
          listing={this.props.slides}
          deleteSlide={this.props.deleteSlide}
          onSortEnd={this.sortEnd}
          load={this.props.load}
          helperClass="sortableHelper"
          useDragHandle={true}/>
      </div>
    )
  }
}

Listing.propTypes = {
  slides: PropTypes.array,
  deleteSlide: PropTypes.func,
  load: PropTypes.func,
  sectionId: PropTypes.number,
}
