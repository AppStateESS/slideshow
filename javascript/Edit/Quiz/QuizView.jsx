'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class QuizView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let questions = undefined
    if (this.props.quizContent != null) {
      //console.log(this.props.quizContent)
      // TODO: fix bug with icon not changing when correct does. We need to force a rerender 
      questions = this.props.quizContent.answers.map(function (question, i) {
        //let key = question
        let check = (<i className="fas fa-times-circle" style={{ color: 'red' }}></i>)
        if (this.props.quizContent.correct != undefined) {
          if ((this.props.quizContent.correct).includes(i.toString())) {
            check = (<i className="fas fa-check-circle" style={{ color: 'green' }}></i>)
          }
        }
        return (
          <div key={question}>
            <p>{check} {question}</p>
          </div>
        )
      }.bind(this))
    }
    // TODO: rework this to be more pretty
    // Also need to handle open answers
    let title = (this.props.quizContent == undefined) ? 'No data loaded' : this.props.quizContent.question
    return (
      <div>
        <h1>{title}</h1>
        {questions}
      </div>
    )
  }
}

QuizView.propTypes = {
  quizContent: PropTypes.object,
  toggle: PropTypes.func
}
