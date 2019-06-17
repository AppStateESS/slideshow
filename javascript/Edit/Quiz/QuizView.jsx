'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Button
} from 'react-bootstrap'

export default class QuizView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quizContent: {
        questionTitle: 'No data Loaded',
        answers: ['this might be an error']
      }
    }
  }

  componentDidMount() {
    if (this.props.quizContent != undefined) {
      this.setState({
        quizContent: JSON.parse(this.props.quizContent)
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.quizContent != prevProps.quizContent && this.props.quizContent != undefined) {
      this.setState({
        quizContent: JSON.parse(this.props.quizContent)
      })
    }
  }

  render() {
    let questions = undefined
    if (this.state.quizContent.answers != undefined) {
      questions = this.state.quizContent.answers.map((question, i) => {
        let check = (<i className="fas fa-times-circle" style={{color: 'red'}}></i>)
        if (this.state.quizContent.correctAnswerIndex == i) {
        check = (<i className="fas fa-check-circle" style={{color: 'green'}}></i>)
        }
        return (
          <div key={question}>
            <p>{check} {question}</p>
          </div>
        )
      })
    }
    // TODO: rework this to be more pretty
    // Also need to handle open answers
    return (
      <span>
        <h1>{this.state.quizContent.questionTitle}</h1>
        {questions}
        <Button variant="outline-primary" onClick={this.props.toggle} block><i className="fas fa-edit"></i> Edit Quiz Slide</Button>
      </span>
    )
  }
}

QuizView.propTypes = {
  quizContent: PropTypes.string,
  toggle: PropTypes.func
}
