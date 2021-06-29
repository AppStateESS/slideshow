'use strict'
import React from 'react'
import TextColor from './TextColor'
import Media from './Media'
import Link from './Link'
import {EditorState, RichUtils, Modifier} from 'draft-js'
import Tippy from '@tippyjs/react'
import Background from './Background'
import PropTypes from 'prop-types'
import './toolbar.css'
import 'tippy.js/themes/light-border.css'

/** In this file, I have most of the buttons as function components. At the bottom, I have a final composite Toolbar component. */

/** Undo and Redo */
function UndoRedo(props) {
  function _undo() {
    props.setEditorState(EditorState.undo(props.getEditorState()))
  }

  function _redo() {
    props.setEditorState(EditorState.redo(props.getEditorState()))
  }

  return (
    <span>
      <button className="toolbar" onClick={_undo.bind(this)}>
        <i className="fas fa-undo"></i>
      </button>

      <button className="toolbar" onClick={_redo.bind(this)}>
        <i className="fas fa-redo"></i>
      </button>
    </span>
  )
}

UndoRedo.propTypes = {
  getEditorState: PropTypes.func,
  setEditorState: PropTypes.func,
}

/** Bold and Italic */
function BoldItalic(props) {
  function _toggleInlineStyle(event) {
    const eState = props.getEditorState()
    props.setEditorState(
      RichUtils.toggleInlineStyle(eState, event.currentTarget.id)
    )
  }

  return (
    <span>
      <button id="BOLD" className="toolbar" onClick={_toggleInlineStyle}>
        <i className="fas fa-bold"></i>
      </button>
      <button id="ITALIC" className="toolbar" onClick={_toggleInlineStyle}>
        <i className="fas fa-italic"></i>
      </button>
    </span>
  )
}
BoldItalic.propTypes = {
  getEditorState: PropTypes.func,
  setEditorState: PropTypes.func,
}

/** Blocks */
function Blocks(props) {
  function _toggleBlockType(event) {
    const eState = RichUtils.toggleBlockType(
      props.getEditorState(),
      event.currentTarget.id
    )
    props.setEditorState(EditorState.moveFocusToEnd(eState))
  }

  return (
    <span>
      <button
        id="header-one"
        className="toolbar"
        onClick={_toggleBlockType.bind(this)}>
        <strong>H1</strong>
      </button>
      <button
        id="header-two"
        className="toolbar"
        onClick={_toggleBlockType.bind(this)}>
        <strong>H2</strong>
      </button>
      <button
        id="header-three"
        className="toolbar"
        onClick={_toggleBlockType.bind(this)}>
        <strong>H3</strong>
      </button>
      <button
        id="unordered-list-item"
        className="toolbar"
        onClick={_toggleBlockType.bind(this)}>
        <i className="fas fa-list-ul"></i>
      </button>
      <button
        id="ordered-list-item"
        className="toolbar"
        onClick={_toggleBlockType.bind(this)}>
        <i className="fas fa-list-ol"></i>
      </button>
    </span>
  )
}
Blocks.propTypes = {
  getEditorState: PropTypes.func,
  setEditorState: PropTypes.func,
}

/** Alignment */
function Alignment(props) {
  function _alignBlock(event) {
    const toggledAlignment = 'align-' + event.currentTarget.id
    const editorState = props.getEditorState()
    const contentState = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    let currBlock = contentState.getBlockForKey(selection.getFocusKey())
    const bData = currBlock.getData().set('align', toggledAlignment)
    const newContentState = Modifier.setBlockData(
      contentState,
      selection,
      bData
    )
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-block-data'
    )
    props.setEditorState(newEditorState)
  }

  return (
    <span>
      <button id="left" className="toolbar" onClick={_alignBlock}>
        <i className="fas fa-align-left"></i>
      </button>
      <button id="center" className="toolbar" onClick={_alignBlock}>
        <i className="fas fa-align-center"></i>
      </button>
      <button id="right" className="toolbar" onClick={_alignBlock}>
        <i className="fas fa-align-right"></i>
      </button>
    </span>
  )
}

Alignment.propTypes = {
  getEditorState: PropTypes.func,
  setEditorState: PropTypes.func,
}

export default function Toolbar(props) {
  return (
    <div className="tool">
      <UndoRedo
        setEditorState={props.setEditorState}
        getEditorState={props.getEditorState}
      />
      <span className="separator"></span>
      <BoldItalic
        setEditorState={props.setEditorState}
        getEditorState={props.getEditorState}
      />
      <TextColor
        setEditorState={props.setEditorState}
        getEditorState={props.getEditorState}
      />
      <span className="separator"></span>
      <Blocks
        setEditorState={props.setEditorState}
        getEditorState={props.getEditorState}
      />
      <span className="separator"></span>
      <Alignment
        setEditorState={props.setEditorState}
        getEditorState={props.getEditorState}
      />
      <span className="separator"></span>
      <Background changeBackground={props.saveBackground} />
      <Media 
        saveMedia={props.saveMedia} 
        insertMedia={props.insertMedia}
        validate={props.validate}
        mediaView={props.mediaView}
        mediaCancel={props.mediaCancel}
        mediaOpen={props.mediaOpen}
      />
      <Link
        setEditorState={props.setEditorState}
        getEditorState={props.getEditorState}
      />
    </div>
  )
}

Toolbar.propTypes = {
  getEditorState: PropTypes.func,
  setEditorState: PropTypes.func,
  saveBackground: PropTypes.func,
  saveMedia: PropTypes.func,
  insertMedia: PropTypes.func,
  validate: PropTypes.func,
  mediaView: PropTypes.bool,
  mediaCancel: PropTypes.func,
  mediaOpen: PropTypes.func
}
