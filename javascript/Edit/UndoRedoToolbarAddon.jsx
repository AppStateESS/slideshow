'use strict'
import React, { Component } from 'react'
import './buttonStyle.css'

import { EditorState, AtomicBlckUtils} from 'draft-js'

export default class UndoRedoToolbarAddon extends Component {
  constructor(props) {
    super(props)
  }

  _undo() {
    this.props.setEditorState(EditorState.undo(this.props.getEditorState()))
  }

  _redo() {
    this.props.setEditorState(EditorState.redo(this.props.getEditorState()))
  }

  render() {
    return (
      <span>
        <button className="toolbar" onClick={this._undo.bind(this)}><i className="fas fa-undo"></i></button>
        <button className="toolbar" onClick={this._redo.bind(this)}><i className="fas fa-redo"></i></button>
      </span>
    )
  }
}
