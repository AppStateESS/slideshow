'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Form,
  InputGroup
} from 'react-bootstrap'

export default class QuizViewspace extends Component {

  constructor() {
    super()

    this.state = {
      answers: undefined,
      correct: false,
      incorrect: false
    }

    this.validate = this.validate.bind(this)
    this.buildAnswerComponent = this.buildAnswerComponent.bind(this)
    this.toggleCorrectAlert = this._toggleCorrect.bind(this)
    this.toggleIncorrectAlert = this._toggleIncorrect.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentSlide != prevProps.currentSlide) {
      this.setState({correct:false, incorrect:false})
    }
  }

  validate(event) {
    let ids = event.target.id.split('-')
    if (ids[0] === 'select') {
      // MultipleChoice
      if (ids[1] == this.props.content.quizContent.correctAnswerIndex) {
        this.props.validate()
        this.toggleCorrectAlert()
      }
      else {
        this.toggleIncorrectAlert()
      }
    }
  }

  _toggleCorrect() {
    this.setState({correct: true, incorrect: false})
  }

  _toggleIncorrect() {
    this.setState({incorrect: true})
  }

  buildAnswerComponent() {
    if (this.props.content.quizContent != undefined) {
      let i = -1
      let a = this.props.content.quizContent.answers.map((answer) => {
        i += 1

        // Shows a check if the answer has been correctly answered before
        let c = this.props.content.quizContent.correctAnswerIndex
        let ans = ((this.props.currentSlide < this.props.highestSlide) && (c == i)) ?
          (<span>{answer} <i className="fas fa-check-circle" style={{color: 'green'}}></i></span>) : answer

        return (
          <div key={`answer-${i}-${this.props.currentSlide}`} className='mb-3'>
            <Form.Check
              custom
              type='radio'
              id={`select-${i}`}
              name={`answers-${this.props.currentSlide}`}
              label={ans}
              onClick={this.validate}
            />
          </div>)
      })
      return (
        <Form>
          {a}
        </Form>
      )
    }
  }

  render() {
    let alert = undefined
    if (this.state.correct) {
      alert = (<Alert key={this.state.currentSlide} variant="success">
                <span>Correct! <i className="fas fa-check-circle" style={{color: "green"}}></i></span>
               </Alert>)
    }
    else if (this.state.incorrect) {
      alert = (<Alert key={this.state.currentSlide} variant="danger">Please try again</Alert>)
    }
    else if (this.props.currentSlide == this.props.highestSlide) {
      alert = <Alert key={this.state.currentSlide} variant="dark">Select the correct answer to continue</Alert>
    }

    let answersComponent = undefined
    let titleComponent = undefined
    if (this.props.content.quizContent == undefined) {
      titleComponent = "Error - Empty Quiz"
      answersComponent = (<div>
                            <p style={{color: 'red'}}>This quiz slide has not been filled with data</p>
                            <p>If you are a student, contact the one responsible for making you take this</p>
                            <p>If you are an admin, fill out this slide with data</p>
                          </div>)
      alert = undefined
      //this.validate(null) This could allow user to continue
    }
    else {
     answersComponent = this.buildAnswerComponent()
     titleComponent = this.props.content.quizContent.questionTitle
    }
    return (
      <div>
        <h3>{titleComponent}:</h3>
        {answersComponent}
        {alert}
      </div>)
  }
}

QuizViewspace.propTypes = {
  content: PropTypes.object,
  currentSlide: PropTypes.number,
  highestSlide: PropTypes.number
}
