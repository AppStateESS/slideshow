'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './custom.css'

import Editor, { createEditorStateWithText, createWithContent } from 'draft-js-plugins-editor'
import {EditorState, ContentState, getDefaultKeyBinding, KeyBindingUtil, convertToRaw, convertFromRaw} from 'draft-js'

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from 'draft-js-buttons'


const {hasCommandModifier} = KeyBindingUtil

export default class Workspace extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
    }
    this.onEditChange = (editorState) =>  {
      this.setState({editorState})
    }

    this.loadEditorState = this.loadEditorState.bind(this)
    this.saveEditorState = this.saveEditorState.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.saveKeyBindingFn = this.saveKeyBindingFn.bind(this)
    this.deleteElement = this.deleteElement.bind(this)
  }

  componentDidMount() {
    if (this.props.content != null || this.props.content != undefined) {
      this.loadEditorState(this.props.content)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.content != undefined) {
      this.saveEditorState()
      if (prevProps.content != this.props.content || prevProps.currentSlide !== this.props.currentSlide) {
        this.loadEditorState(this.props.content)
      }
    }
  }

  loadEditorState(content) {
    // If there isn't any content then we make some
    if (content.saveContent === undefined || content.saveContent == null) {
      let body = ""
      switch (content.type) {
        case 'Title':
          body = "Please click me to enter a TITLE."
          break;
        case 'Textbox':
          body = "Please click me to enter BODY TEXT."
          break;
        case 'Image':
          body = "PLACEHOLDER FOR AN IMAGE"
          break;
        case 'Quiz':
          body = "PLACEHOLDER FROM A QUIZ"
          break;
        default:
          body = "Insert text here."
      }

      this.setState({
         editorState: createEditorStateWithText(body)
       })

       this.saveEditorState()
    } else {

      let contentState = convertFromRaw(JSON.parse(content.saveContent))
      this.setState({
        editorState: EditorState.createWithContent(contentState)
      })
    }
  }

  saveEditorState() {
    if (this.state.editorState != undefined) {
      // See draft.js documentation to understand what these are:
      let contentState = this.state.editorState.getCurrentContent()
      let saveContent = JSON.stringify(convertToRaw(contentState))

      this.props.saveContentState(saveContent, this.props.content.id - 1)
    }
  }

  saveKeyBindingFn(e) {
    // This function will handle a "ctrl-s" as a save
    // TODO: this method currently doesn't work in the way that it should.
    if (e.keyCode === 83 && hasCommandModifier(e)) {
      return 'save'
    }
    return getDefaultKeyBinding(e)
  }

  handleKeyCommand(command) {
    // This will handle other key comamnds such as "ctrl-z"
    if (command === 'save') {
      // perform a save whether this may be a function call or something idk.
      this.saveEditorState()
      return 'handled'
    }
    return 'not-handled'
  }

  _undo()
  {
    // This is here but it is not yet implemented
    // I will add this to a button on the nav bar at some point
    this.onEditChange(EditorState.undo(EditorState))
  }

  _redo()
  {
    this.onEditChange(EditorState.redo(EditorState))
  }

  deleteElement() {
    this.props.deleteElement(this.props.content)
  }

  render() {
    var editorStyle = {
      padding: '5px',
      border: '1px solid grey',
      borderRadius: '5px'
    }

    return (
      <div>
        <div style={this.state.hasFocus ? editorStyle : {}}>
          <div className="row no-gutters">
            <div className="cust-col-11">
              <Editor
                editorState={this.state.editorState}
                onChange={this.onEditChange}
                plugins={this.props.plugins}
                handleKeyCommand={this.handleKeyCommand}
                keyBindingFn={this.saveKeyBindingFn}
                onFocus={() => this.setState({ hasFocus: true })}
                onBlur={() => this.setState({ hasFocus: false })}
                ref={(element) => { this.editor = element; }} />
            </div>
            <div className="cust-col-1">
              <a className="close" aria-label="Close" onClick={this.deleteElement}>
                <span aria-hidden="true">&times;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

Workspace.propTypes = {
  content: PropTypes.object,
  save: PropTypes.func
}
