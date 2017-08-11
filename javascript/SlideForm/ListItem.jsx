'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {SortableHandle} from 'react-sortable-hoc'

export default class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.view = this.view.bind(this)
    this.edit = this.edit.bind(this)
    this.deleteDecision = this.deleteDecision.bind(this)
  }

  /* global $ */

  deleteDecision(id) {
    $.ajax({
      url: './slideshow/Decision/' + id,
      dataType: 'json',
      type: 'delete',
      success: function () {
        this.props.load()
      }.bind(this),
      error: function () {}.bind(this),
    })
  }

  view() {}

  render() {
    const {slideKey, value, editSlide, deleteSlide, createDecision, editDecision} = this.props
    const DragHandle = SortableHandle(() => DragTag())
    let decisions = <span>
      <em>Continue normally</em>
    </span>
    if (value.decisions !== null) {
      decisions = value.decisions.map(function (value, key) {
        const clicks = {
          editDecision: editDecision,
          deleteDecision: this.deleteDecision,
          view: this.view,
        }
        return <DecisionButton key={key} index={key} {...clicks} {...value}/>
      }.bind(this))
    }
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
        <div style={{
          overflow: 'auto'
        }}>
          <button
            className="btn btn-primary pull-right"
            onClick={createDecision.bind(null, value.id)}>
            <i className="fa fa-plus"></i>&nbsp;Choice</button>
          {decisions}
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
  createDecision: PropTypes.func,
  editDecision: PropTypes.func,
  load: PropTypes.func,
}

const DecisionButton = ({title, id, deleteDecision, editDecision, index}) => {
  const _style = {
    marginRight: '8px'
  }
  return (
    <div className="btn-group" role="group" style={_style}>
      <button className="btn btn-default">{title}</button>
      <button className="btn btn-primary" onClick={editDecision.bind(null, index)}>
        <i className="fa fa-edit"></i>
      </button>
      <button className="btn btn-danger" onClick={deleteDecision.bind(null, id)}>
        <i className="fa fa-trash-o"></i>
      </button>
    </div>
  )
}

DecisionButton.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  editDecision: PropTypes.func,
  deleteDecision: PropTypes.func,
  view: PropTypes.func
}
