'use strict'
import React from 'react'

import './toolbar.css'
import TextColor from './TextColor'
import Media from './Media'
import Link from './Link'

import { EditorState, RichUtils, Modifier } from 'draft-js'
import Tippy from '@tippy.js/react'
import Background from './Background'

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
          <Tippy content={<div>Undo</div>} arrow={true}>
            <button className="toolbar" onClick={_undo.bind(this)}><i className="fas fa-undo"></i></button>
          </Tippy>
          <Tippy content={<div>Redo</div>} arrow={true}>
            <button className="toolbar" onClick={_redo.bind(this)}><i className="fas fa-redo"></i></button>
          </Tippy>
        </span>
      )
}

/** Bold and Italic */
function BoldItalic(props) {
  function _toggleInlineStyle(event) {
    const eState = props.getEditorState()
    props.setEditorState(RichUtils.toggleInlineStyle(eState, event.currentTarget.id))
  }

  return (
    <span>
        <Tippy content={<div>Bold</div>} arrow={true}>
          <button id="BOLD" className="toolbar" onClick={_toggleInlineStyle}><i className="fas fa-bold"></i></button>
        </Tippy>
        <Tippy content={<div>Italic</div>} arrow={true}>
          <button id="ITALIC" className="toolbar" onClick={_toggleInlineStyle}><i className="fas fa-italic"></i></button>
        </Tippy>
      </span>
  )
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
        <Tippy content={<div>Heading 1</div>} arrow={true}>
          <button id="header-one" className="toolbar" onClick={_toggleBlockType.bind(this)}><strong>H1</strong></button>
        </Tippy>
        <Tippy content={<div>Heading 2</div>} arrow={true}>
          <button id="header-two" className="toolbar" onClick={_toggleBlockType.bind(this)}><strong>H2</strong></button>
        </Tippy>
        <Tippy content={<div>Heading 3</div>} arrow={true}>
          <button id="header-three"className="toolbar" onClick={_toggleBlockType.bind(this)}><strong>H3</strong></button>
        </Tippy>
        <Tippy content={<div>Bullet List</div>} arrow={true}>
          <button id="unordered-list-item" className="toolbar" onClick={_toggleBlockType.bind(this)}><i className="fas fa-list-ul"></i></button>
        </Tippy>
        <Tippy content={<div>Number List</div>} arrow={true}>
          <button id="ordered-list-item" className="toolbar" onClick={_toggleBlockType.bind(this)}><i className="fas fa-list-ol"></i></button>
        </Tippy>
      </span>
    )
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
    const newContentState = Modifier.setBlockData(contentState, selection, bData)
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-block-data'
    )
    props.setEditorState(newEditorState)
  }

  return (
    <span>
      <Tippy
        content={<div>Align Left</div>}
        arrow={true}>
        <button id="left" className="toolbar" onClick={_alignBlock}><i className="fas fa-align-left"></i></button>
      </Tippy>
      <Tippy
        content={<div>Align Center</div>}
        arrow={true}>
        <button id="center" className="toolbar" onClick={_alignBlock}><i className="fas fa-align-center"></i></button>
      </Tippy>
      <Tippy
        content={<div>Align Right</div>}
        arrow={true}>
        <button id="right" className="toolbar" onClick={_alignBlock}><i className="fas fa-align-right"></i></button>
      </Tippy>
    </span>
  )
}

export default function Toolbar(props) {
    return (
      <div className="tool">
        <UndoRedo setEditorState={props.setEditorState} getEditorState={props.getEditorState} />
        <span className="separator"></span>
        <BoldItalic setEditorState={props.setEditorState} getEditorState={props.getEditorState} />
        <TextColor setEditorState={props.setEditorState} getEditorState={props.getEditorState} />
        <span className="separator"></span>
        <Blocks setEditorState={props.setEditorState} getEditorState={props.getEditorState}/>
        <span className="separator"></span>
        <Alignment setEditorState={props.setEditorState} getEditorState={props.getEditorState} />
        <span className="separator"></span>
        <Background changeBackground={props.saveBackground}/>
        <Media saveMedia={props.saveMedia}/>
        <Link setEditorState={props.setEditorState} getEditorState={props.getEditorState} />
      </div>
    )
}

