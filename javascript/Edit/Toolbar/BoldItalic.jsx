
'use strict'
import React from 'react'
import './buttonStyle.css'
import Tippy from '@tippy.js/react'
import { RichUtils } from 'draft-js'

export default function BoldItalic(props) {

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