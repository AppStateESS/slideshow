'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {SortableContainer, SortableElement,} from 'react-sortable-hoc'
import ListItem from './ListItem.jsx'
import DecisionForm from './DecisionForm.jsx'
import Modal from '../AddOn/Html/Modal.jsx'
import './slide.css'

/* global $ */

export default class Listing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false
    }
    this.sortEnd = this.sortEnd.bind(this)
    this.showForm = this.showForm.bind(this)
    this.hideForm = this.hideForm.bind(this)
  }

  hideForm() {
    this.setState({showForm: false})
  }

  sortEnd(movement) {
    const {oldIndex, newIndex,} = movement
    const newPosition = this.props.listing[newIndex].sorting
    const movingSlideId = this.props.listing[oldIndex].id
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

  showForm() {
    this.setState({showForm : true})
  }

  render() {
    const {listing} = this.props
    if (listing.length === 0) {
      return <div>No slides found</div>
    }

    const modal = (
      <Modal
        isOpen={this.state.showForm}
        close={this.hideForm}
        width="90%"
        height="90%">
        <div>
          <DecisionForm/>
          <hr/>
          <div className="text-center">
            <button className="btn btn-primary" onClick={this.hideForm}>Close</button>
          </div>
        </div>
      </Modal>
    )

    return (
      <div className="slide-listing">
        {modal}
        <ul>
          <SortableList
            listing={this.props.listing}
            deleteSlide={this.props.delete}
            editSlide={this.props.edit}
            showForm={this.showForm}
            onSortEnd={this.sortEnd}
            helperClass="sortableHelper"
            useDragHandle={true}/>
        </ul>
      </div>
    )
  }
}

Listing.propTypes = {
  listing: PropTypes.array.isRequired,
  edit: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  sectionId: PropTypes.number,
  load: PropTypes.func.isRequired,
  updateListing: PropTypes.func.isRequired
}

const SortableItem = SortableElement(({slideKey, value, editSlide, deleteSlide, showForm}) => {
  return (<ListItem
    slideKey={slideKey}
    value={value}
    editSlide={editSlide}
    deleteSlide={deleteSlide}
    showForm={showForm}/>)
})

const SortableList = SortableContainer(({listing, editSlide, deleteSlide, showForm,}) => {
  let slides = listing.map(function (value, key) {
    return (<SortableItem
      index={key}
      key={key}
      slideKey={key}
      value={value}
      editSlide={editSlide}
      deleteSlide={deleteSlide}
      showForm={showForm}/>)
  })

  return (
    <ul>
      {slides}
    </ul>
  )
})
