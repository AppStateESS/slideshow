'use strict'
import React, { Component } from 'react'
import './buttonStyle.css'

import { EditorState, Modifier, RichUtils, SelectionState} from 'draft-js'

import AlignmentMap from '../../Resources/AlignmentMap.js'

export default class Alignment extends Component {
  constructor(props) {
    super(props)


    this.align = this.align.bind(this)
  }

  align(event) {
    let toggledAlignment = 'align-' + event.currentTarget.id

    const editorState = this.props.getEditorState() 
    let selection = editorState.getSelection()

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


    // If nothing is currently selected, then we align the block
    if (selection.isCollapsed()) {
      // Note: this alignment will only apply to things that have no alignment already
      // So, if something has been aligned through select then things get deselected,
      // it won't align unless reselected. Consider this an align all
      const contentState = newEditorState.getCurrentContent()
      const anchorKey = selection.getAnchorKey()
      const currBlock = contentState.getBlockForKey(anchorKey)
      const bData = currBlock.getData().set('align', toggledAlignment)
      const newContentState = Modifier.setBlockData(contentState, selection, bData)
      newEditorState = EditorState.push(
        newEditorState,
        newContentState,
        'change-block-data'
      )
    }

    const currStyle = editorState.getCurrentInlineStyle() 

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
