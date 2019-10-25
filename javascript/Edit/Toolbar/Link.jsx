'use strict'
import React, { Component } from 'react'
import './toolbar.css'

import { EditorState, RichUtils} from 'draft-js'
import decorator from '../../Resources/Draft/LinkDecorator'

import Tippy from '@tippy.js/react'
import 'tippy.js/themes/light-border.css'

export default class Link extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: '',
      selected: 'Select some text'
    }

    this.updateLink = (event) => {this.setState({link: event.target.value})}

    this.insertLink = this.insertLink.bind(this)
    this.updateSelected = this.updateSelected.bind(this)
  }

  insertLink() {
    const editorState = this.props.getEditorState()
    const contentState = editorState.getCurrentContent()

    const contentWithEntity = contentState.createEntity(
      'LINK',
      'IMMUTABLE', // This causes the entire link text to delete 
      {url: this.state.link}
    )
    const entityKey = contentWithEntity.getLastCreatedEntityKey()

    let newEditor = EditorState.set(editorState, {currentContent: contentWithEntity, decorator: decorator})

    newEditor = RichUtils.toggleLink(newEditor, newEditor.getSelection(), entityKey)
    //newEditor = RichUtils.toggleInlineStyle(newEditor, 'underline')*/
    this.props.setEditorState(newEditor)
  }

  updateSelected() {
    const editorState = this.props.getEditorState()
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()

    let select = "Please select some text"
    if (!selectionState.isCollapsed()) {
      // Text is selected
      const key = selectionState.getAnchorKey()
      select = contentState.getBlockForKey(key).getText()
      const start = selectionState.getStartOffset()
      const end = selectionState.getEndOffset()
      select = select.slice(start, end)
    }
    
    this.setState({
      selected: select
    })
  }

  render() {
    let linkPopover = (
      <div style={{padding: 10, width: 300}}>

        <h5>Insert a url</h5>
        <span style={{textAlign: 'center'}}>Selected Text</span>
        <div className="input-group mb-3">
          <input type="text" className="form-control" value={this.state.selected} style={selectedText} readOnly/>
        </div>
        <div className="input-group mb-3">
          <input onChange={this.updateLink} type="text" className="form-control" placeholder="Paste a link" style={inputStyle}/>
        </div>
        <button className="btn btn-primary btn-block" onClick={this.insertLink}>Apply</button>
        
      </div>
    )

    return (
      <span onMouseEnter={this.updateSelected}>
        <Tippy
          theme="light-border"
          content={linkPopover}
          placement="bottom"
          arrow={true}
          animation="fade" 
          //trigger="click"
          interactive={true}
        >
          <button className="toolbar"><i className="fas fa-link"></i></button>
        </Tippy>
      </span>
    )
  }
}

const inputStyle = {
  //borderRadius: 10,
  textAlign: 'center',
  color: 'royalblue'
}

const selectedText = {
  textAlign: 'center',
  color: 'darkslategrey',
  borderRadius: 10
}