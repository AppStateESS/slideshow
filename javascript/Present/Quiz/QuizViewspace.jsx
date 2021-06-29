import React, { useState, useEffect } from 'react'

import AnswersComponent from './AnswerComponent'
import Alert from './QuizAlert'

export default function QuizViewspace(props) {

  const [selected, setSelected] = useState([])
  const [gradeState, setGradeState] = useState('unchosen')

  useEffect(() => {
    setSelected([])
    setGradeState('unchosen')
  }, [props.currentSlide])

  function validate(e) {
    let ids = e.target.id.split('-')
    let s = [...selected]
    let g = 'incorrect'
    if (props.quizContent.type === 'choice') {
      s = [Number(ids[1])]
      if (evaluateChoice(s)) {
        g = 'correct'
        props.validate()
      }
    } // Multiple select
    else {
      if (!s.includes(Number(ids[1]))) {
        s.push(Number(ids[1]))
      } else {
        s = s.filter((i) => i != Number(ids[1]))
      }
      // Not evaluated until button gets pressed
      g = gradeState
    }
    setGradeState(g)
    setSelected(s)
  }

  function evaluateChoice(s) {
    if (s.length != props.quizContent.correct.length) {
      return false
    }
    for (let value of props.quizContent.correct) {
      if (!s.includes(Number(value))) {
        return false
      }
    }
    return true
  }

  function evaluateSelect(s) {
    if (s === undefined) s = [...selected]
    let partial = false
    let correct = true
    for (let value of props.quizContent.correct) {
      if (!selected.includes(Number(value))) {
        correct = false
      } else {
        partial = true
      }
    }
    let g = 'unchosen'
    if (correct) {
      g = 'correct'
      props.validate()
    }
    else if (partial) g = 'partial'
    else g = 'incorrect'
    setGradeState(g)
  }


  let answersComponent = undefined
  let titleComponent = undefined
  if (props.quizContent == undefined) {
    titleComponent = "Error - Empty Quiz"
    answersComponent = (<div>
      <p style={{ color: 'red' }}>This quiz slide has not been filled with data</p>
      <p>If you are a student, contact the one responsible for making you take this</p>
      <p>If you are an admin, fill out this slide with data</p>
    </div>)
  }
  else {
    answersComponent = <AnswersComponent quizContent={props.quizContent} currentSlide={props.currentSlide} highestSlide={props.highestSlide} finish={props.finished} onClick={validate} validateSelect={evaluateSelect} />
    titleComponent = props.quizContent.question
  }

  let image = undefined
  let align = undefined
  
  if (props.content.media != undefined) {
    image = (
      <div className="col">
        <img src={props.content.media.imgUrl} alt={props.content.media} style={{ height: '100%', width: '100%', objectFit: 'scale-down' }}></img>
      </div>
    )
    align = props.content.media.align
  }

  return (
    <div className="row">
      {(align === 'left') ? image : undefined}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'start', height: '100%' }}>
        <h3>{titleComponent}</h3>
        {answersComponent}
        <span style={{ display: 'flex', alignItems: 'flex-end', width: '100%', height: '100%' }}>
          <Alert feedback={props.quizContent.feedback} state={gradeState} selected={selected} qType={props.quizContent.type} />
        </span>
      </div>
      {(align === 'right') ? image : undefined}
    </div>
  )
}