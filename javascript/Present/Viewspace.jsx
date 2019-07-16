'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Editor, EditorState, convertFromRaw } from 'draft-js'

export default class Viewspace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }
    this.loadEditorState = this.loadEditorState.bind(this)
  }

  componentDidMount() {
    // decode the Editor state from the content field.
    if (this.props.content.saveContent != undefined) {
      this.loadEditorState(this.props.content)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.content.saveContent != this.props.content.saveContent) {
      this.loadEditorState()
    }
  }

  loadEditorState(content) {
    let contentState = convertFromRaw(JSON.parse(this.props.content.saveContent))

    this.setState({
      editorState: EditorState.createWithContent(contentState)
    })
  }

  render() {
    let image = undefined
    //console.log(this.props.content.media)
    if (this.props.content.media != undefined && this.props.content.media.length > 0) {
      image = (
        <div className="col">
          <img src={this.props.content.media} alt={this.props.content.media} style={{height: '100%', width: '100%', objectFit: 'scale-down'}}></img>
        </div>
      )
    }
    return (
      <div className="row">
        <div className="col">
          <Editor editorState={this.state.editorState} readOnly />
        </div>
        {image}
      </div>

    )
  }
}

Viewspace.propTypes = {
  content: PropTypes.object,
}
