'use strict'
import React, { Component } from 'react'
import './buttonStyle.css'

import { EditorState, Modifier, RichUtils, SelectionState} from 'draft-js'

import AlignmentMap from '../../Resources/AlignmentMap.js'

import Tippy from '@tippy.js/react'

export default class Alignment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selection: SelectionState.createEmpty(), 
      anchorKey: undefined,
    }


    this.align = this.align.bind(this)
  }

  align(event) {
    let toggledAlignment = 'align-' + event.currentTarget.id

    const editorState = this.props.getEditorState()
    const contentState = editorState.getCurrentContent()
    let newEditorState = editorState  
    let selection = editorState.getSelection()
    let anchorKey = selection.getAnchorKey()

    if (this.state.anchorKey != undefined && anchorKey != this.state.anchorKey) {
      // dump cache bc slides/or content block was changed
      anchorKey = this.state.anchorKey
    }
    const currBlock = contentState.getBlockForKey(anchorKey)
    // If nothing is currently selected
    if (selection.isCollapsed()) {
      // if the cached selection is undefined, then we align the block
      if (this.state.selection.isCollapsed()) {
        // Note: this alignment will only apply to things that have no alignment already
        // So, if something has been aligned through select then things get deselected,
        // it won't align unless reselected. Consider this an align all
        const bData = currBlock.getData().set('align', toggledAlignment)
        const newContentState = Modifier.setBlockData(contentState, selection, bData)
        newEditorState = EditorState.push(
          editorState,
          newContentState,
          'change-block-data'
        )
      }
      else {
        // retrieve cached selection
        selection = this.state.selection
      }

    }
    if (!selection.isCollapsed()) {
      // remove old alignment
      let newContentState = Object.keys(AlignmentMap)
        .reduce((contentState, alignment) => {
            return Modifier.removeInlineStyle(contentState, selection, alignment)
        }, editorState.getCurrentContent())
      
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        'change-inline-style'
      )
    }
      

    const currStyle = editorState.getCurrentInlineStyle() 

    if (!currStyle.has(toggledAlignment)) {
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, toggledAlignment)
    }

    // cache the selection
    this.setState({selection: selection, anchorKey: anchorKey})
    this.props.setEditorState(EditorState.moveFocusToEnd(newEditorState))
  }

  render() {
    return (
      <span>
        <Tippy
          content={<div>Align Left</div>}
          arrow={true}>
          <button id="left" className="toolbar" onClick={this.align}><i className="fas fa-align-left"></i></button>
        </Tippy>
        <Tippy
          content={<div>Align Center</div>}
          arrow={true}>
          <button id="center" className="toolbar" onClick={this.align}><i className="fas fa-align-center"></i></button>
        </Tippy>
        <Tippy
          content={<div>Align Right</div>}
          arrow={true}>
          <button id="right" className="toolbar" onClick={this.align}><i className="fas fa-align-right"></i></button>
        </Tippy>
      </span>
    )
  }
}
