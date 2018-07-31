'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Editor, { createEditorStateWithText, createWithContent } from 'draft-js-plugins-editor'
import {EditorState, getDefaultKeyBinding, KeyBindingUtil, convertToRaw, convertFromRaw} from 'draft-js'

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

import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin'
import 'draft-js-static-toolbar-plugin/lib/plugin.css'

const staticToolbar = createToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
  ]
})


const { Toolbar } = staticToolbar

const plugins = [
  staticToolbar,
]

const {hasCommandModifier} = KeyBindingUtil

export default class EditView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeIndex: props.currentSlide,
      editorState: EditorState.createEmpty(),
      toolBarActive: false,
      hasFocus: false,
      content: {
        title: props.content['title'],
        body: props.content['body'],
      }
    }
    this.onEditChange = (editorState) =>  {
      this.saveEditorState()
      this.setState({editorState})
    }

    this.loadEditorState = this.loadEditorState.bind(this)
    this.fetchContent = this.fetchContent.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.saveKeyBindingFn = this.saveKeyBindingFn.bind(this)
  }

  componentDidMount() {
    this.loadEditorState()
  }

  componentDidUpdate(prevProps) {
   // this might cause an issue when a state that isn't related to slide change updates.
   // Like hasFocus
   //
    if (prevProps.content != this.props.content || prevProps.currentSlide !== this.props.currentSlide) {
      this.fetchContent(this.props)
    }
  }

  loadEditorState(content) {
    // if there is no saved data(content), then we make a new editor with content
    if (!content) {
      this.setState({
        editorState: createEditorStateWithText("Click me to add text :)")
      })
    }
    else {
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(content))
      })
    }
  }

  saveEditorState() {
    const contentState = convertToRaw(this.state.editorState.getCurrentContent())
    this.props.save(contentState)
  }

  fetchContent(data) {
    this.setState({
      activeIndex: data.currentSlide,
      content: {
        title: data.content['title'],
        body: data.content['body'],
      }
    })
    this.loadEditorState(data.content['textBoxContent'])
  }

  saveKeyBindingFn(e) {
    // This function will handle a "ctrl-s" as a save
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
      alert("content saved!\nbut not to the db, but it's in the console tho :P")
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

  render() {
    var editorStyle = {
      padding: '5px',
      border: '1px solid grey',
      borderRadius: '5px'
    }
    return (
      <div className="col-8" >
        <Toolbar />
        <span><br /></span>
        <div className="jumbotron">
          <h2>{this.state.content.title}</h2>
          <div style={this.state.hasFocus ? editorStyle : {}}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onEditChange}
            plugins={plugins}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.saveKeyBindingFn}
            onFocus={() => this.setState({ hasFocus: true })}
            onBlur={() => this.setState({ hasFocus: false })}
            ref={(element) => { this.editor = element; }} />
          </div>
        </div>

      </div>
    )
  }

}


EditView.propTypes = {
  currentSlide: PropTypes.number,
  content: PropTypes.object,
  save: PropTypes.func
}
