'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Editor, { createEditorStateWithText, createWithContent, composeDecorators } from 'draft-js-plugins-editor'
import {EditorState, ContentState, getDefaultKeyBinding, RichUtils, KeyBindingUtil, convertToRaw, convertFromRaw} from 'draft-js'

import QuizCreateForm from './Quiz/QuizCreateForm.jsx'
import QuizView from './Quiz/QuizView.jsx'

// Toolbar imports
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
} from 'draft-js-buttons'

import CustomButtons from './CustomToolbarButtons.jsx'
import UndoRedo from './UndoRedoButtons.jsx'

import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin'
import 'draft-js-static-toolbar-plugin/lib/plugin.css'

// Imports for images
import createImagePlugin from 'draft-js-image-plugin'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import createAlignmentPlugin from 'draft-js-alignment-plugin'
import createFocusPlugin from 'draft-js-focus-plugin';

const alignmentPlugin = createAlignmentPlugin()
const { AlignmentTool } = alignmentPlugin
const resizeablePlugin = createResizeablePlugin()
const focusPlugin = createFocusPlugin();

const staticToolbar = createToolbarPlugin({
  structure: [
    UndoRedo,
    Separator,
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
    Separator,
    CustomButtons
  ]
})

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
)

const imagePlugin = createImagePlugin({ decorator })

const { Toolbar } = staticToolbar

const plugins = [
  staticToolbar,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin
]

export default class EditView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      quizEditView: true,
      updated: false
    }

    this.saveEditorState = this.saveEditorState.bind(this)

    this.onEditChange = (editorState) =>  {
      this.setState({
        editorState,
        updated: true
      })
      //this.saveEditorState()
    }


    this.loadEditorState = this.loadEditorState.bind(this)

    this.saveQuizContent = this.saveQuizContent.bind(this)
    this.toggleQuizEdit = this.toggleQuizEdit.bind(this)
  }

  componentDidMount() {
    this.loadEditorState()
  }

  componentDidUpdate(prevProps) {

    // handle of non-quiz slides
    if (this.props.content != undefined && !this.props.isQuiz) {
      if (this.props.currentSlide != prevProps.currentSlide || this.props.content.saveContent != prevProps.content.saveContent) {
        // catch the load from the database and the changing of slides
        this.loadEditorState()
      }
      else if (this.state.updated) {
        // current component updated
        this.saveEditorState()
        this.setState({updated:false})
      }
    }

    // If quiz component updated and the data is there then we switch to view mode else we switch to edit mode.
    if (prevProps.content.quizContent != this.props.content.quizContent) {
      // Yes i understand this would be a good spot to use a ternary operator, but we use that too much. :P
      if (this.props.content.quizContent != undefined) {
        this.setState({quizEditView: false})
      }
      else {
        this.setState({quizEditView: true})
      }
    }
  }

  loadEditorState() {
    // If we aren't loading a quiz
    if (!this.props.isQuiz) {
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
  }

  saveEditorState() {
    if (this.state.editorState != undefined) {
      // See draft.js documentation to understand what these are:
      let contentState = this.state.editorState.getCurrentContent()
      let saveContent = JSON.stringify(convertToRaw(contentState))

      this.props.saveContentState(saveContent)
    }
  }

  saveQuizContent(quizContent) {
    this.toggleQuizEdit()
    this.props.saveQuizContent(quizContent)
  }

  toggleQuizEdit() {
    this.setState({
      quizEditView: !this.state.quizEditView
    })
  }

  render() {

    var editorStyle = {
      padding: '5px',
      border: '1px solid grey',
      borderRadius: '5px'
    }

    let editor = (
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
    )

    let quizView = (this.state.quizEditView) ?
      <QuizCreateForm quizContent={this.props.content.quizContent} saveQC={this.saveQuizContent} saveDB={this.props.saveDB} toggle={this.toggleQuizEdit}/> :
      <QuizView quizContent={this.props.content.quizContent} toggle={this.toggleQuizEdit}/>

    let editRender = (this.props.isQuiz) ? (quizView) : (editor)
    let toolbar = (this.props.isQuiz) ? undefined : (<Toolbar />)
    return (
      <div className="col-8" style={{minWidth: 700}}>
        <p></p>
        {toolbar}
        <span><br /></span>
        <div className="jumbotron" style={{minHeight: 350}}>
          {editRender}
        </div>
      </div>
    )
  }

}


EditView.propTypes = {
  currentSlide: PropTypes.number,
  content: PropTypes.object,
  isQuiz: PropTypes.bool,
  saveContentState: PropTypes.func,
  saveQuizContent: PropTypes.func,
  saveDB: PropTypes.func,
}
