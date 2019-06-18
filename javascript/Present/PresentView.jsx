'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Viewspace from './Viewspace.jsx'
import QuizViewspace from './QuizViewspace.jsx'

export default class PresentView extends Component {
  constructor(props) {
    super(props)
    this.parseQ = this._parseQuizFlag
  }

  _parseQuizFlag(quizT) {
    if (quizT == undefined) return false // initial load
    return (typeof(quizT) === "boolean") ? quizT : JSON.parse(quizT)
  }

  render() {
    if (this.props.content != undefined) {
      let viewspace = (this.parseQ(this.props.content.isQuiz)) ?
        (<QuizViewspace
          content={this.props.content}
          currentSlide={this.props.currentSlide}
          highestSlide={this.props.high}
          next={this.props.nextSlide}
          validate={this.props.validate} />) :
        <Viewspace content={this.props.content} />
      return (
        <div className="mh-100">
          <div className="jumbotron" style={{minHeight: 350}}>
            {viewspace}
          </div>
        </div>
      )
    }
    return null
  }
}

PresentView.propTypes = {
  content: PropTypes.object,
  currentSlide: PropTypes.number,
  high: PropTypes.number,
  //nextSlide: PropTypes.function,
}
