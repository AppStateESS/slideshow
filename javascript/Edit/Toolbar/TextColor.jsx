'use strict'
import React, { Component } from 'react'
import './buttonStyle.css'

import {EditorState, RichUtils, Modifier, SelectionState} from 'draft-js'

import Tippy from '@tippy.js/react'
import 'tippy.js/themes/light-border.css'
import {CirclePicker, ChromePicker} from 'react-color'

import TextColorMap from '../../Resources/TextColorMap.js'

export default class TextColor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      color: 'black',
      selection: SelectionState.createEmpty(),
      anchorKey: undefined,
      showAdvanced: false
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
    let selection = editorState.getSelection()
    let anchorKey = selection.getAnchorKey()

    if (this.state.anchorKey != undefined && anchorKey != this.state.anchorKey) {
      // dump cache bc slides/or content block was changed
      anchorKey = this.state.anchorKey
    }

    if (selection.isCollapsed()) {
      // Nothing is selected so we use the previous selection
      selection = this.state.selection
      if (selection.isCollapsed()) {
        alert("Please select some text to apply this color")
      }
    }
    // Cache Selection and its Key
    this.setState({selection: selection, anchorKey: anchorKey})

    // Advanced Color
    const color = editorState.getCurrentInlineStyle().keys().next().value
    const styleAddon = '{"' + color + '":{"color":"' + color + '"}}'
    const styles = Object.assign(JSON.parse(styleAddon), TextColorMap)

    // remove other colors first
    let newContentState = Object.keys(styles)
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
    


    if (!currStyle.has(toggledColor)) {
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, toggledColor)
    }

    this.props.setEditorState(EditorState.moveFocusToEnd(newEditorState))
  }


  render() {

    let advancedColor = (this.state.showAdvanced) ?
      (<div style={advancedColorStyle}><ChromePicker color={this.state.color} onChangeComplete={this.changeColor} /></div>) : (undefined)

    let colorPopover = (
      <div style={popoverStyle}>
        <h5>Adjust Text Color</h5>
        <CirclePicker color={this.state.color} colors={Object.keys(TextColorMap)} onChange={this.changeColor}/>
        <br></br>
        <div>
          <button className="btn btn-primary btn-block" 
            onClick={() => this.setState({showAdvanced: !this.state.showAdvanced})}>
              Advanced Color
          </button>
          {advancedColor}
        </div>
        
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
  padding: 10,
  marginLeft: 'auto',
  marginRight: 'auto',
}

const advancedColorStyle = {
  paddingTop: 10,
  marginLeft: 10,
}