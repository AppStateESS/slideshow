'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {Editor, EditorState, ContentState, RichUtils, KeyBindingUtil, convertToRaw, convertFromRaw} from 'draft-js'
const {hasCommandModifier} = KeyBindingUtil

import QuizEdit from './Quiz/QuizEdit.jsx'
import QuizView from './Quiz/QuizView.jsx'

import ToolbarC from './Toolbar/Toolbar.jsx'
import ImageC from '../AddOn/ImageColumn.jsx'
import CustomStyleMap from '../Resources/CustomStyleMap.js';
import decorator from '../Resources/LinkDecorator.js'
import CustomBlockFn from '../Resources/CustomBlockFn.js'

export default class EditView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(decorator),
      quizEditView: true,
      updated: false,
      imgUrl: props.content.media.imgUrl,
      mediaAlign: ''
    }

    this.saveEditorState = this.saveEditorState.bind(this)

    this.onEditChange = (editorState) => {
      this.setState({
        editorState,
        updated: true
      }, () => this.saveEditorState())
    }


    this.loadEditorState = this.loadEditorState.bind(this)
    this.functions = this._functions.bind(this)
    this.handleKeyCommand = this._handleKeyCommand.bind(this)

    this.saveQuizContent = this.saveQuizContent.bind(this)
    this.toggleQuizEdit = this.toggleQuizEdit.bind(this)
    this.alignMedia = this.alignMedia.bind(this)
  }

  componentDidMount() {
    this.loadEditorState()
  }

  componentDidUpdate(prevProps, prevState) {

    // handle of non-quiz slides
    if (this.props.content != undefined && !this.props.isQuiz) {
      if (this.props.currentSlide != prevProps.currentSlide || this.props.content.saveContent != prevProps.content.saveContent) {
        // catch the load from the database and the changing of slides
        if (this.props.content.media != undefined) {
          this.setState({imgUrl: this.props.content.media.imgUrl, mediaAlign: this.props.content.media.align})
        }
        this.loadEditorState()
      }
      else if (this.state.updated) {
        // current component updated
        this.saveEditorState()
        this.setState({ updated: false })
      }
    }

    // If quiz component updated and the data is there then we switch to view mode else we switch to edit mode.
    if (prevProps.content.quizContent != this.props.content.quizContent) {
      // Yes i understand this would be a good spot to use a ternary operator, but we use that too much. :P
      if (this.props.content.quizContent != undefined) {
        this.setState({ quizEditView: false })
      }
      else {
        this.setState({ quizEditView: true })
      }
    }

    let newImgUrl = (this.props.content.media == undefined) ? "" : this.props.content.media.imgUrl
    let newAlign = (this.props.content.media == undefined) ? "" : this.props.content.media.align
    if (this.state.imgUrl != newImgUrl) {
      this.setState({imgUrl: newImgUrl, mediaAlign: newAlign})
    }
  }

  loadEditorState() {
    // If we aren't loading a quiz
    if (!this.props.isQuiz) {
      // If there isn't any content then we make some
      if (this.props.content.saveContent == undefined) {
        const eState = EditorState.createWithContent(ContentState.createFromText("New Slide"), decorator)
        this.onEditChange(RichUtils.toggleBlockType(eState, 'header-one'))
      } else {
        if (this.props.content.saveContent.length > 0) {
          const contentState = convertFromRaw(JSON.parse(this.props.content.saveContent))
          this.onEditChange(EditorState.createWithContent(contentState, decorator))
        }
        else {
          alert("An error has occured. Your data may have been corrupted. This slide will be reset.")
          const eState = EditorState.createWithContent(ContentState.createFromText("New Slide"), decorator)
          this.onEditChange(RichUtils.toggleBlockType(eState, 'header-one'))
        }
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

  alignMedia() {
    let align =  (this.state.mediaAlign === 'right') ? 'left' : 'right'
    this.setState({mediaAlign: align})
    this.props.saveMedia(this.state.imgUrl, align)
  }

  _functions(e) {
    // This is currently deprecated 
    // bc of a bug where the default key commands did not 
    // function properly
    // I will keep the code here, however, for the case
    // we want to use this in the future

    // User presses L key
    if (e.keyCode == 76 && hasCommandModifier(e)) {
      return 'load'
    }
    else if (e.keyCode == 83 /* S key */ && hasCommandModifier(e)) {
      return 'save'
    }
    /*else if (e.keyCode == 13) {
      return 'split-block'
    }*/
  }
  
  _handleKeyCommand(command) {
    // This is currently deprecated 
    // bc of a bug where the default key commands did not 
    // function properly
    // I will keep the code here, however, for the case
    // we want to use this in the future
    if (command === 'save') {
      console.log("saved")
      this.props.saveDB()
      return 'handled'
    } 
    else if (command === 'load') {
      this.props.saveDB()
      console.log("loaded")
      window.setTimeout(() => this.props.load(), 500)
      return 'handled'
    }
    else if (command === 'split-block') {
      console.log('split-block')
      const cState = this.state.editorState.getCurrentContent()
      const eState = EditorState.push(this.state.editorState, cState, 'split-block')
      this.onEditChange(eState)
    }
    else {
      console.log("unhandeled key command")
      return 'unhandled'
    }
  }

  render() {

    var editorStyle = {
      padding: '5px',
      border: '1px solid grey',
      borderRadius: '5px'
    }

    let styles = CustomStyleMap

    if (this.state.editorState != undefined) {
      // Custom text color 
      const color = this.state.editorState.getCurrentInlineStyle().keys().next().value
      if (color != undefined) {
        const styleObj = JSON.parse('{"' + color + '":{"color":"' + color + '"}}')
        styles = Object.assign(styleObj, CustomStyleMap)
      }
    }

    let editor = (
      <div className="cust-col-11" style={this.state.hasFocus ? editorStyle : { padding: '5px' }}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onEditChange}
          //handleKeyCommand={this.handleKeyCommand}
          //keyBindingFn={this.functions}
          //onFocus={() => this.setState({ hasFocus: true })}
          //onBlur={() => this.setState({ hasFocus: false })}
          customStyleMap={styles} 
          blockStyleFn={CustomBlockFn}
          spellCheck={true}/>
      </div>
    )

    let quizView = (this.state.quizEditView) ?
      <QuizEdit quizContent={this.props.content.quizContent} saveQC={this.saveQuizContent} saveDB={this.props.saveDB} toggle={this.toggleQuizEdit} /> :
      <QuizView quizContent={this.props.content.quizContent} toggle={this.toggleQuizEdit} />

    let editRender = (this.props.isQuiz) ? (quizView) : (editor)
    let imgRender = (this.state.imgUrl != undefined) ?
                            <ImageC key={this.state.imgUrl} src={this.state.imgUrl} remove={this.props.removeMedia} align={this.alignMedia} mediaAlign={this.state.mediaAlign} height={'100%'} width={'100%'}/> // Note: we can custom the width and length through these fields
                            : undefined
    let toolbar = (this.props.isQuiz) ? undefined : 
      <ToolbarC setEditorState={this.onEditChange} getEditorState={() => this.state.editorState} saveMedia={this.props.saveMedia}/>
     
    return (
      <div className="col-8" style={{ minWidth: 700 }}>
        <p></p>
        {toolbar}
        <span><br /></span>
        <div className="jumbotron" style={{minHeight: 350, backgroundColor: this.props.content.backgroundColor}}>
          <div className="row">
            {(this.state.mediaAlign === 'left') ? imgRender : undefined}
            <div className="col">
              {editRender}
            </div>
            {(this.state.mediaAlign === 'right') ? imgRender : undefined}
            </div>
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
  load: PropTypes.func,
  saveMedia: PropTypes.func,
  removeMedia: PropTypes.func
}
