'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Form,
  Button
} from 'react-bootstrap'

export default class QuizViewspace extends Component {

  constructor() {
    super()

    this.state = {
      answers: undefined,
      correct: false,
      incorrect: false,
      view: 'showTypes',
      checked: [],
      partiallyCorrect: false
    }

    this.validate = this.validate.bind(this)
    this.buildAnswerComponent = this.buildAnswerComponent.bind(this)
    this.toggleCorrect = this._toggleCorrect.bind(this)
    this.toggleIncorrect = this._toggleIncorrect.bind(this)
    this.compareArrays = this.compareArrays.bind(this)
    this.togglePartiallyCorrect = this.togglePartiallyCorrect.bind(this)
    this.comparePartiallyCorrect = this.comparePartiallyCorrect.bind(this)
  }

  componentDidMount() {
    if (this.props.quizContent != undefined) {
      let view = 'showTypes'
      if (this.props.content.quizContent != undefined) {
        view = this.props.content.quizContent.questionType
      }
      this.setState({
        view: view
      })
    }
  }


  componentDidUpdate(prevProps) {
    if (this.props.currentSlide != prevProps.currentSlide) {
      this.setState({ correct: false, incorrect: false })
    }
  }

  validate(event) {
    let ids = event.target.id.split('-')
    if (ids[0] === 'check') {
      // MultipleChoice
      if (this.props.content.quizContent.correctAnswers.includes(ids[1])) {
        this.props.validate()
        this.toggleCorrect()
      }
      else {
        this.toggleIncorrect()
      }
    }
    else if (ids[0] === 'select') {
      let copyChecked = [...this.state.checked]
      if (copyChecked.includes(ids[1])) {
        let i = copyChecked.findIndex(test => { return test == ids[1] })
        copyChecked.splice(i, 1)
      } else {
        copyChecked.push(ids[1])
      }
      this.setState({
        checked: copyChecked
      })
    }
    else if (event.target.id === 'verifySelect') {
      if (this.compareArrays()) {
        this.props.validate()
        this.toggleCorrect()
      }
      else if (this.comparePartiallyCorrect()) {
        this.togglePartiallyCorrect()
      }
      else {
        this.toggleIncorrect()
      }
    }
  }

  _toggleCorrect() {
    this.setState({ correct: true, incorrect: false, partiallyCorrect: false })
  }

  _toggleIncorrect() {
    this.setState({ incorrect: true, correct: false, partiallyCorrect: false })
  }

  togglePartiallyCorrect() {
    this.setState({ partiallyCorrect: true, correct: false, incorrect: false })
  }

  buildAnswerComponent() {
    if (this.props.content.quizContent != undefined) {
      let i = -1
      let a = this.props.content.quizContent.answers.map((answer) => {
        i += 1

        // Shows a check if the answer has been correctly answered before
        let c = this.props.content.quizContent.correctAnswerIndex
        let ans = ((this.props.currentSlide < this.props.highestSlide) && (c == i)) ?
          (<span>{answer} <i className="fas fa-check-circle" style={{ color: 'green' }}></i></span>) : answer

        return (
          <div key={`answer-${i}-${this.props.currentSlide}`} className='mb-3'>
            <Form.Check
              custom
              type='radio'
              id={`check-${i}`}
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

  buildSelectComponent() {
    if (this.props.content.quizContent != undefined) {
      let i = -1
      let a = this.props.content.quizContent.answers.map((answer) => {
        i += 1

        // Shows a check if the answer has been correctly answered before
        let c = this.props.content.quizContent.correctAnswerIndex
        let ans = ((this.props.currentSlide < this.props.highestSlide) && (c == i)) ?
          (<span>{answer} <i className="fas fa-check-circle" style={{ color: 'green' }}></i></span>) : answer

        return (
          <div key={`answer-${i}-${this.props.currentSlide}`} className='mb-3'>
            <Form.Check
              custom
              type='checkbox'
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
          <Button key={'checkAnswer'} id={'verifySelect'} variant="primary" onClick={this.validate} style={{ marginBottom: '2rem' }}><i size="sm"></i>Click to check answer</Button>
        </Form>
      )
    }
  }

  compareArrays() {
    if (this.state.checked.length != this.props.content.quizContent.correctAnswers.length) {
      return false
    }
    for (let value of this.props.content.quizContent.correctAnswers) {
      if (!this.state.checked.includes(value)) {
        return false
      }
    }
    return true
  }

  comparePartiallyCorrect() {
    for (let value of this.props.content.quizContent.correctAnswers) {
      if (this.state.checked.includes(value)) {
        return true
      }
    }
    return false
  }

  render() {
    let alert = undefined

    if (this.state.correct) {
      alert = (<Alert key={'correct'} variant="success">
        <span>Correct! <i className="fas fa-check-circle" style={{ color: "green" }}></i></span>
      </Alert>)
    }
    else if (this.state.incorrect) {
      alert = (<Alert key={'incorrect'} variant="danger">
        <span>Please try again <i className="fas fa-times-circle"></i></span>
      </Alert>)
    }
    else if (this.state.partiallyCorrect) {
      alert = (<Alert key={'partial'} variant="warning">
        <span>You are partially correct <i className="fas fa-exclamation-circle"></i></span>
      </Alert>)
    }
    else if (this.props.currentSlide == this.props.highestSlide) {
      alert = <Alert key={this.state.currentSlide} variant="dark">Select the correct answer to continue</Alert>
    }
    let answersComponent = undefined
    let titleComponent = undefined
    if (this.props.content.quizContent == undefined) {
      titleComponent = "Error - Empty Quiz"
      answersComponent = (<div>
        <p style={{ color: 'red' }}>This quiz slide has not been filled with data</p>
        <p>If you are a student, contact the one responsible for making you take this</p>
        <p>If you are an admin, fill out this slide with data</p>
      </div>)
      alert = undefined
      //this.validate(null) This could allow user to continue
    }
    else if (this.props.content.quizContent.questionType == 'choice') {
      answersComponent = this.buildAnswerComponent()
      titleComponent = this.props.content.quizContent.questionTitle
    }
    else if (this.props.content.quizContent.questionType == 'select') {
      answersComponent = this.buildSelectComponent()
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
