import React from 'react'

import { Form, Button } from 'react-bootstrap'

const { Check } = Form

export default function AnswerComponent(props) {
    if (props.quizContent != undefined) {
      let a = props.quizContent.answers.map((answer, i) => {
        // Shows a check if the answer has been correctly answered before
        const c = props.quizContent.correct
        let ans = ((props.currentSlide < props.highestSlide || props.finished) && (c.includes(i) || c.includes(i.toString()))) ?
          (<span>{answer} <i className="fas fa-check-circle" style={{ color: 'green' }}></i></span>) : answer
        return (
          <div key={`answer-${i}-${props.currentSlide}`} className='mb-3'>
            <Check
              custom
              type={(props.quizContent.type === 'choice') ? 'radio' : 'checkbox'}
              id={(props.quizContent.type === 'choice') ? `check-${i}` : `select-${i}`}
              name={`answers-${props.currentSlide}`}
              label={ans}
              onClick={props.onClick}
            />
          </div>)
      })

      const selectButton = (
        <Button key={'checkAnswer'} id={'verifySelect'} variant="primary" onClick={props.validateSelect} style={{ marginBottom: '2rem' }}><i size="sm"></i>Check answer</Button>
      )
      return (
        <Form>
          {a}
          {props.quizContent.type === 'select' ? selectButton : undefined}
        </Form>
      )
    }
    return null
  }