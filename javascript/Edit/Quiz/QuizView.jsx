'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class QuizView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let answers = undefined
    if (this.props.quizContent != null) {
      //console.log(this.props.quizContent)
      // TODO: fix bug with icon not changing when correct does. We need to force a rerender 
      let type = (this.props.quizContent.type === 'select') ? 'square' : 'circle' 
      answers = this.props.quizContent.answers.map(function (question, i) {
        // random key to ensure that the icons get rerendered each time
        const k =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let check = (<i className={`fas fa-minus-${type}`} style={{ color: 'red' }}></i>)
        if (this.props.quizContent.correct != undefined) {
          if ((this.props.quizContent.correct).includes(i.toString())) {
            check = (<i className={`fas fa-check-${type}`} style={{ color: 'green' }}></i>)
          }
        }
        return (
          <div key={question}>
            <p key={k}>{check} {question}</p>
          </div>
        )
      }.bind(this))
    }
    else {
      answers = (<div><p>This slide may have been corrupted. We apolgize for the error.</p></div>)
    }
    // TODO: rework this to be more pretty
    // Also need to handle open answers
    let title = (this.props.quizContent == undefined) ? 'No data loaded' : this.props.quizContent.question
    return (
      <div>
        <h1>{title}</h1>
        {answers}
      </div>
    )
  }
}

QuizView.propTypes = {
  quizContent: PropTypes.object,
  toggle: PropTypes.func
}
