'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import QuizEdit from './Quiz/QuizEdit.jsx'
import QuizView from './Quiz/QuizView.jsx'

import Editor from './DraftEditor'
import ToolbarC from './Toolbar/Toolbar.jsx'
import ToolbarQ from './Toolbar/QuizToolbar.jsx'
import ImageC from './AddOn/ImageColumn.jsx'



import 'animate.css'

export default class EditView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      quizEditView: true,
      imgUrl: props.content.media.imgUrl,
      mediaAlign: ''
    }

    this.saveQuizContent = this.saveQuizContent.bind(this)
    this.toggleQuizEdit = this.toggleQuizEdit.bind(this)
    this.alignMedia = this.alignMedia.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {

    // handle of non-quiz slides
    if (this.props.content != undefined && !this.props.content.isQuiz) {
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
      if (this.props.content.quizContent != null /*&& this.props.content.quizContent != null*/) {
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

  

  saveQuizContent(quizContent) {
    this.toggleQuizEdit()
    this.props.saveQuizContent(quizContent)
  }

  async toggleQuizEdit() {
    this.setState({
      quizEditView: !this.state.quizEditView
    })
  }

  alignMedia() {
    let align =  (this.state.mediaAlign === 'right') ? 'left' : 'right'
    this.setState({mediaAlign: align})
    this.props.saveMedia(this.state.imgUrl, align)
  }

  render() {


    let quizView = (this.state.quizEditView) ?
      <QuizEdit quizContent={this.props.content.quizContent} load={this.props.load} saveQC={this.saveQuizContent} saveDB={this.props.saveDB} toggle={this.toggleQuizEdit} /> :
      <QuizView quizContent={this.props.content.quizContent} toggle={this.toggleQuizEdit} />

    let editRender = (this.props.content.isQuiz) ? (quizView) : (<Editor saveContent={this.props.content.saveContent} saveContentState={this.props.saveContentState}/>) // TODO
    let imgRender = (this.state.imgUrl != undefined) ?
                            <ImageC key={this.state.imgUrl} src={this.state.imgUrl} remove={this.props.removeMedia} align={this.alignMedia} mediaAlign={this.state.mediaAlign} height={'100%'} width={'100%'}/> // Note: we can custom the width and length through these fields
                            : undefined
    let toolbar = (this.props.content.isQuiz) ?  
      <ToolbarQ toggleQuizEdit={this.toggleQuizEdit} view={this.state.quizEditView} />:
      <ToolbarC setEditorState={this.onEditChange} getEditorState={() => this.state.editorState} saveMedia={this.props.saveMedia}/>
     
    return (
      <div className="col">
        <p></p>
        <div style={{minWidth: 700}}>
          {toolbar}
          <span><br /></span>
          {
            // This code is a little-let's not kid ourselves, it's quite a bit messy. Basicly, I need a different view for quizEdit then the other three views
            (this.state.quizEditView && this.props.content.isQuiz) ? quizView : 
          (
          <div id="editor" data-key={this.props.currentSlide} className="jumbotron" style={{ minHeight: 500, minWidth: 300, height: '8rem', backgroundColor: this.props.content.backgroundColor, overflow:'auto'}}>
            <div className="row">
              {(this.state.mediaAlign === 'left') ? imgRender : undefined}
              <div className="col">
                {editRender}
              </div>
              {(this.state.mediaAlign === 'right') ? imgRender : undefined}
              </div>
          </div>)
          }
        </div>
      </div>
    )
  }
}


EditView.propTypes = {
  currentSlide: PropTypes.number,
  content: PropTypes.object,
  saveContentState: PropTypes.func,
  saveQuizContent: PropTypes.func,
  saveDB: PropTypes.func,
  load: PropTypes.func,
  saveMedia: PropTypes.func,
  removeMedia: PropTypes.func,
  saveThumb: PropTypes.func
}
