'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js'

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
      editorState: createEditorStateWithText("Click me to edit :)"),
      toolBarActive: false,
      hasFocus: false,
      content: {
        title: props.content['title'],
        body: props.content['body'],
      }
    }
    this.onEditChange = (editorState) => this.setState({editorState})

    this.fetchContent = this.fetchContent.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.saveKeyBindingFn = this.saveKeyBindingFn.bind(this)
  }

  componentDidUpdate(prevProps) {
   // this might cause an issue when a state that isn't related to slide change updates.
   // Like hasFocus
   //
   // Also this is where I will save/update the body from the content
    if (prevProps.currentSlide !== this.props.currentSlide) {
      this.fetchContent()
    }
    //console.log(this.state.editorState.getCurrentContent())
  }

  fetchContent(value) {
    let updatedTitle = "TODO: going to get this through an AJAX request"
    let updatedBody = "TODO: going to then set these variable up below, but not for now."
    this.setState({
      content: {
        title: this.props.content['title'],
        body: this.props.content['body']
      }
    })
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
      alert("content saved!\nbut not really becasue this doesn't work yet :P")
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
  content: PropTypes.object
}
