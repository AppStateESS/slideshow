'use strict'
import React, { Component } from 'react'
import './buttonStyle.css'

import { EditorState, Modifier, RichUtils, CompositeDecorator} from 'draft-js'
import decorator from '../Resources/LinkDecorator'

import Tippy from '@tippy.js/react'
import 'tippy.js/themes/light-border.css'

export default class LinkToolbarAddon extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: ''
    }

    this.updateLink = (event) => {this.setState({link: event.target.value})}

    this.insertLink = this.insertLink.bind(this)
  }

  insertLink() {
    const editorState = this.props.getEditorState()
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()

    const contentWithEntity = contentState.createEntity(
      'LINK',
      'IMMUTABLE', // This causes the entire link text to delete 
      {url: this.state.link}
    )
    const entityKey = contentWithEntity.getLastCreatedEntityKey()

    let newEditor = EditorState.set(editorState, {currentContent: contentWithEntity, decorator: decorator})

    newEditor = RichUtils.toggleLink(newEditor, newEditor.getSelection(), entityKey)
    this.props.setEditorState(newEditor)
  }

  render() {
    let linkPopover = (
      <div style={{padding: 10}}>
        <h5>Insert a url</h5>
        <div className="input-group mb-3">
          <input onChange={this.updateLink} type="text" className="form-control" placeholder="" style={inputStyle}/>
        </div>
        <button className="btn btn-secondary btn-block" onClick={this.insertLink}>Insert</button>
        
      </div>
    )

    return (
      <span>
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
  borderRadius: 10,
  textAlign: 'center',
  color: 'royalblue'
}