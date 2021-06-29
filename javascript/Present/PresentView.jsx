'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Viewspace from './Viewspace.jsx'
import QuizViewspace from './Quiz/QuizViewspace.jsx'

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
          quizContent={this.props.content.quizContent}
          currentSlide={this.props.currentSlide}
          highestSlide={this.props.high}
          validate={this.props.validate}
          finished={this.props.finished} />) :
        <Viewspace content={this.props.content} />

              //background styling check image or color
      let backgroundStyle = {minHeight: 500, minWidth: 300, height: '10rem', width: '60rem', backgroundImage: `url(${this.props.content.background})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}
      if (this.props.content.background.charAt(0) === '#') {
          backgroundStyle = {minHeight: 500, minWidth: 300, height: '10rem', width: '60rem', backgroundColor: this.props.content.background}
      }
      return (
          <div className="jumbotron" style={backgroundStyle}>
            {viewspace}
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
  validate: PropTypes.func
}
