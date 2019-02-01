'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Editor, { createEditorStateWithText, createWithContent } from 'draft-js-plugins-editor'
import {EditorState, ContentState, getDefaultKeyBinding, RichUtils, KeyBindingUtil, convertToRaw, convertFromRaw} from 'draft-js'

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

export default class EditView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.onEditChange = (editorState) =>  {
      this.setState({editorState})
    }


    this.loadEditorState = this.loadEditorState.bind(this)
    this.saveEditorState = this.saveEditorState.bind(this)
  }

  componentDidMount() {
    this.loadEditorState()
  }

  componentDidUpdate(prevProps) {
    // This catches the load from the db, which is slower than React's render which is why it's in componentDidUpdate.
    // and when a slide (props) is changed.
    if (prevProps.content.saveContent != this.props.content.saveContent) {
      this.loadEditorState()
    }
    // Save local state anytime that the Component is updated
    if (this.props.content.saveContent != undefined) {
      this.saveEditorState()
    }
  }

  loadEditorState() {
    // If there isn't any content then we make some
    if (this.props.content.saveContent == undefined) {
      let body = "New Slide"
      this.setState({
         editorState: createEditorStateWithText(body)
       }, function() {
         this.onEditChange(RichUtils.toggleBlockType(this.state.editorState, 'header-one'))
         this.saveEditorState()
       })
    } else {
      let contentState = convertFromRaw(JSON.parse(this.props.content.saveContent))
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

      this.props.saveContentState(saveContent)
    }
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
        <p></p>
        <Toolbar />
        <span><br /></span>
        <div className="jumbotron">
          <div className="cust-col-11" style={this.state.hasFocus ? editorStyle : {padding: '5px'}}>
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
  saveContentState: PropTypes.func,
}
