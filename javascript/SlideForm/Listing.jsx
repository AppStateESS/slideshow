'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {SortableContainer, SortableElement} from 'react-sortable-hoc'
import ListItem from './ListItem.jsx'
import DecisionForm from './DecisionForm.jsx'
import Modal from '../AddOn/Html/Modal.jsx'
import Decision from '../Resources/Decision.js'
import Abstract from '../AddOn/Mixin/Abstract.jsx'
import './slide.css'

/* global $ */

export default class Listing extends Abstract {
  constructor(props) {
    super(props)
    this.resourceName = 'Decision'
    this.state = {
      showForm: false,
      resource: new Decision,
      errors: {},
    }
    this.sortEnd = this.sortEnd.bind(this)
    this.createDecision = this.createDecision.bind(this)
    this.hideForm = this.hideForm.bind(this)
  }

  hideForm() {
    this.setState({showForm: false, resource: new Decision})
    this.props.load()
  }

  sortEnd(movement) {
    const {oldIndex, newIndex} = movement
    const newPosition = this.props.listing[newIndex].sorting
    const movingSlideId = this.props.listing[oldIndex].id
    $.ajax({
      url: './slideshow/Slide/' + movingSlideId + '/move',
      data: {
        sectionId: this.props.sectionId,
        varname: 'move',
        newPosition: newPosition,
      },
      success: function () {
        this.props.load()
      }.bind(this),
      dataType: 'json',
      type: 'patch',
    })
  }

  createDecision(slideId) {
    $.ajax({
      url: './slideshow/Decision',
      data: {
        slideId: slideId
      },
      dataType: 'json',
      type: 'post',
      success: function (data) {
        this.setValue('id', data)
        this.setState({showForm: true})
      }.bind(this),
      error: function () {}.bind(this),
    })
  }

  editDecision(id) {
    console.log('wtf')
    console.log(id);
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
          <DecisionForm
            decision={this.state.resource}
            setValue={this.setValue}
            patchValue={this.patchValue}/>
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
            createDecision={this.createDecision}
            editDecision={this.editDecision}
            onSortEnd={this.sortEnd}
            load={this.props.load}
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
  updateListing: PropTypes.func.isRequired,
}

const SortableItem = SortableElement(({
  slideKey,
  value,
  editSlide,
  deleteSlide,
  createDecision,
  editDecision,
  load,
}) => {
  return (<ListItem
    slideKey={slideKey}
    value={value}
    editSlide={editSlide}
    deleteSlide={deleteSlide}
    createDecision={createDecision}
    editDecision={editDecision}
    load={load}/>)
})

const SortableList = SortableContainer(({
  listing,
  editSlide,
  deleteSlide,
  createDecision,
  editDecision,
  load,
}) => {
  let slides = listing.map(function (value, key) {
    return (<SortableItem
      index={key}
      key={key}
      slideKey={key}
      value={value}
      load={load}
      editSlide={editSlide}
      deleteSlide={deleteSlide}
      createDecision={createDecision}
      editDecision={editDecision}/>)
  })

  return (
    <ul>
      {slides}
    </ul>
  )
})
