'use strict'
import React, { Component } from 'react'
import './buttonStyle.css'

import {EditorState, RichUtils, Modifier} from 'draft-js'

import Tippy from '@tippy.js/react'
import 'tippy.js/themes/light-border.css'
import {CirclePicker} from 'react-color'

import TextColorMap from '../Resources/TextColorMap.js'

export default class TextColorToolbarAddon extends Component {
  constructor(props) {
    super(props)

    this.state = {
      color: 'black'
    }

    this.changeColor = this.changeColor.bind(this)
    this.toggleColor = this._toggleColor.bind(this)
  }
  
  changeColor(color, event) {
    this.setState({color: color.hex})
    this.toggleColor(color.hex)
  }

  _toggleColor(toggledColor) {
    const editorState = this.props.getEditorState() 
    const selection = editorState.getSelection()
    //console.log(selection.isCollapsed())
    // remove other colors first
    let newContentState = Object.keys(TextColorMap)
      .reduce((contentState, color) => {
          return Modifier.removeInlineStyle(contentState, selection, color)
      }, editorState.getCurrentContent())
    
    let newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-inline-style'
    )

    const currStyle = editorState.getCurrentInlineStyle() 

    // If nothing is currently selected
    if (selection.isCollapsed()) {
      newEditorState = currStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, newEditorState);
    }


    if (!currStyle.has(toggledColor)) {
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, toggledColor)
    }

    this.props.setEditorState(EditorState.moveFocusToEnd(newEditorState))
  }


  render() {

    let colorPopover = (
      <div style={popoverStyle}>
        <h5>Adjust Text Color</h5>
        <CirclePicker color={this.state.color} onChangeComplete={this.changeColor}/>
      </div>
    )

    return (
      <span>
        <Tippy 
          theme="light-border"
          content={colorPopover}
          placement="bottom"
          arrow={true}
          animation="fade" 
          //trigger="click"
          interactive={true}
          interactiveBorder={10}
        >
          <button className="toolbar" onClick={this.changeColor}><i className="fas fa-font"></i></button>
        </Tippy>
      </span>
    )
    }
}

const popoverStyle = {
  //width: 250,
  //height: 100,
  padding: 10,
}