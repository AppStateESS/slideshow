'use strict'
import React, { Component } from 'react'
import './buttonStyle.css'

import { EditorState, Modifier, RichUtils, SelectionState} from 'draft-js'

import AlignmentMap from '../Resources/AlignmentMap.js'

export default class AlignmentToolbarAddon extends Component {
  constructor(props) {
    super(props)


    this.align = this.align.bind(this)
  }

  align(event) {
    let toggledAlignment = 'align-' + event.currentTarget.id

    const editorState = this.props.getEditorState() 
    const selection = editorState.getSelection()

    
    // remove old alignment
    let newContentState = Object.keys(AlignmentMap)
      .reduce((contentState, alignment) => {
          return Modifier.removeInlineStyle(contentState, selection, alignment)
      }, editorState.getCurrentContent())
    
    let newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-inline-style'
    )

    const currStyle = editorState.getCurrentInlineStyle() 

    // If nothing is currently selected
    if (selection.isCollapsed()) {
      alert("Nothing is selected to align")
    }


    if (!currStyle.has(toggledAlignment)) {
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, toggledAlignment)
    }

    this.props.setEditorState(EditorState.moveFocusToEnd(newEditorState))
  }

  render() {
    return (
      <span>
        <button id="left" className="toolbar" onClick={this.align}><i className="fas fa-align-left"></i></button>
        <button id="center" className="toolbar" onClick={this.align}><i className="fas fa-align-center"></i></button>
        <button id="right" className="toolbar" onClick={this.align}><i className="fas fa-align-right"></i></button>
      </span>
    )
  }
}
