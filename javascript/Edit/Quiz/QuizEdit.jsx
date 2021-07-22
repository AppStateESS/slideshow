import React, {useEffect, useState} from 'react'

import AnswerTypeCards from './AnswerTypeCards.jsx'
import QuestionTitle from './QuestionTitleBlock.jsx'
import AnswerBlock from './AnswerBlock.jsx'
import SettingsModal from './AnswerSettings'

import './quiz.css'
import {saveQuiz} from '../../api/quiz.js'

import 'animate.css'
import Tippy from '@tippyjs/react'
import {Form} from 'react-bootstrap'
import PropTypes from 'prop-types'

const {Row, Group, Check} = Form

export default function QuizEdit(props) {
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState(['', '']) // : string[]
  const [correct, setCorrect] = useState([]) // : number[]
  const [type, setType] = useState('showTypes')
  const [feedback, setFeedback] = useState([
    'global',
    'Correct!',
    'Please try again',
  ]) // : string[]
  const [id, setId] = useState(-1)

  const [showModal, setShowModal] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [feedCheck, setFeedCheck] = useState(false)

  const animationType = 'animated slideInRight faster'

  useEffect(() => {
    let initQuestion = ''
    let initAnswers = ['', '']
    let initCorrect = []
    let initType = 'showTypes'
    let initFeedback = ['global', 'Correct!', 'Please try again']
    let initId = window.sessionStorage.getItem('quizId')

    let initFeedCheck = false
    // This will only be true if the slide is empty
    if (props.quizContent != null && props.quizContent.correct != null) {
      // Hooks are not allowed to be called in conditonals which is why there is this horrible code structure here
      initQuestion = props.quizContent.question
      initAnswers = props.quizContent.answers
      initCorrect = props.quizContent.correct
      initType = props.quizContent.type
      initFeedback = props.quizContent.feedback
      initId = props.quizContent.quizId
      initFeedCheck = initFeedback[0] === 'local'
    }
    setQuestion(initQuestion)
    setAnswers(initAnswers)
    setCorrect(initCorrect)
    setType(initType)
    setFeedback(initFeedback)
    setId(initId)
    setFeedCheck(initFeedCheck)
    setShowCustom(initFeedCheck)
  }, [])

  async function save() {
    if (correct.length === 0) {
      alert('Please select a correct answer.')
      return
    } else if (type === 'choice' && feedCheck) {
      // Checks to make sure all of feeback is filled out
      for (let i = 2; i < feedback.length; i++) {
        if (feedback[i] == undefined || feedback[i] == '') {
          alert('Please ensure that all custom answers are filled out.')
          return
        }
      }
    }

    let quizContent = {
      quizId: id,
      question: question,
      answers: answers,
      correct: correct,
      type: type,
      feedback: feedback,
    }
    const saved = await saveQuiz(id, quizContent)

    if (saved) {
      props.saveQuizContent(quizContent)
      await props.load()
    } else {
      alert('an error has occurred when saving')
    }

    props.toggle()
  }

  function handleAnswerChange(e) {
    const ids = e.target.id.split('-')
    const type = ids[0]
    const i = Number(ids[1])
    let answerCopy = [...answers]
    let correctCopy = [...correct]
    if (type == 'text') {
      answerCopy[ids[1]] = e.target.value
    } else if (type === 'choice') {
      // This is multiple choice and there is only one correct answer
      correctCopy[0] = i
    } else if (type === 'select') {
      // handle change
      // if the is is in the array we need to remove it, if the id is not we add it
      if (correctCopy.includes(i) || correctCopy.includes(i.toString())) {
        // remove current choice from correct
        let item = correctCopy.findIndex((index) => {
          return index == i
        })
        correctCopy.splice(item, 1)
      } else {
        // Add new choice to correct
        correctCopy.push(i)
      }
    }

    setAnswers(answerCopy)
    setCorrect(correctCopy)
  }

  function switchView(e) {
    setType(e.target.id)
  }

  function addAnswer() {
    let a = [...answers]
    a.push('')
    setAnswers(a)
  }

  function removeAnswer(id) {
    let answerCopy = [...answers]
    let correctCopy = [...correct]
    let feedbackCopy = [...feedback]

    if (correctCopy.includes(id.toString())) {
      const index = correctCopy.indexOf(id.toString())
      correctCopy.splice(index, 1)
    }
    answerCopy.splice(id, 1)
    feedbackCopy.splice(id + 3, 1)
    setAnswers(answerCopy)
    setCorrect(correctCopy)
    setFeedback(feedbackCopy)
  }

  function toggleFeedCheck() {
    let feedbackCopy = [...feedback]
    let fc = feedbackCopy[0] === 'local'
    if (type === 'select') {
      // This shouldn't get triggered since I remove the ui option but I will leave it here in case
      alert('Custom Local Feedback is not supported for multiple select')
      fc = true
    }
    feedbackCopy[0] = fc ? 'global' : 'local'
    setFeedback(feedbackCopy)
    setFeedCheck(!fc)
    setShowCustom(!fc)
  }

  function buildAnswerBlock(type) {
    if (type !== 'choice' && type != 'select') return undefined
    let i = -1
    let choices = answers.map((choice, key) => {
      let checked = correct.includes(key.toString()) || correct.includes(key)
      return (
        <AnswerBlock
          type={type}
          key={`answer-${key}`}
          id={key}
          onChange={handleAnswerChange}
          remove={removeAnswer}
          value={choice}
          checked={checked}
          custom={showCustom}
          setFeedback={(f) => setFeedback(f)}
          feedback={feedback}
        />
      )
    })

    let bottomBlock = (
      <Row style={{marginLeft: '10%'}}>
        <Group key="g1" style={{width: '60%', marginRight: '1rem'}}>
          <button
            key={'add'}
            className="btn btn-primary btn-block"
            onClick={() => addAnswer()}>
            <i className="fas fa-plus-circle"></i> Add Another Answer
          </button>
        </Group>
        <Group key="g2">
          <Tippy content={<div>Answer Settings</div>} arrow={true}>
            <span
              style={{fontSize: '32px', color: 'dimgray'}}
              onClick={() => setShowModal(true)}>
              <i className="fas fa-cog"></i>
            </span>
          </Tippy>
        </Group>
        {type === 'choice' ? (
          <Group key="g3">
            <Tippy
              content={
                <div>
                  {!showCustom ? 'Show ' : 'Hide '} Custom Answer responses
                </div>
              }
              arrow={true}>
              <div
                style={{marginLeft: 10, padding: '3px'}}
                onClick={() => setShowCustom(!showCustom)}>
                <span style={{fontSize: '28px', color: 'dimgray'}}>
                  <i className="fas fa-comment-alt"></i>
                </span>
              </div>
            </Tippy>
          </Group>
        ) : null}
        {type === 'choice' ? ( // Only support custom feedback on multipleChoice for now
          <Group className="flexbox-mid" key="4">
            <Check
              custom
              type="checkbox"
              id="localResponse"
              name={'localResponse'}
              checked={feedCheck}
              label="Use custom responses"
              onChange={toggleFeedCheck}
            />
            {/*<label>Enable Individual Custom Responses</label>*/}
          </Group>
        ) : null}
      </Row>
    )
    choices.push(bottomBlock)
    return choices
  }

  let answerTypeBlock =
    type === 'showTypes' ? (
      <AnswerTypeCards switchView={switchView} selectOne={correct} />
    ) : null

  let showAddElement =
    type === 'showTypes' ? undefined : (
      <span>
        <button
          id="showTypes"
          key="2"
          className="btn btn-secondary btn-block"
          onClick={switchView}>
          <i className="fas fa-undo"></i> Change Answer Type
        </button>
        <button key="3" className="btn btn-primary btn-block" onClick={save}>
          <i className="fas fa-save"></i> Save Quiz Slide
        </button>
      </span>
    )

  const quizBuild = buildAnswerBlock(type)

  return (
    <div className={animationType} style={containerStyle}>
      <h3 style={{textAlign: 'center'}}>Edit Quiz</h3>
      <div>
        <QuestionTitle
          placeholder={'Question Title'}
          value={question}
          onChange={(e) => setQuestion(e.currentTarget.value)}
          id={0}
        />
        <hr style={{border: '1px solid', width: '50%'}}></hr>
        {quizBuild}
        {answerTypeBlock}
        {showAddElement}
      </div>
      <SettingsModal
        show={showModal}
        onHide={() => setShowModal(false)}
        setFeedback={(f) => setFeedback(f)}
        feedback={feedback}
        toggleGlobal={toggleFeedCheck}
      />
    </div>
  )
}

QuizEdit.propTypes = {
  setAnimation: PropTypes.func,
  quizContent: PropTypes.object,
  saveQuizContent: PropTypes.func,
  load: PropTypes.func,
  toggle: PropTypes.func,
}

const containerStyle = {
  padding: '20px',
  backgroundColor: '#E5E7E9',
  borderRadius: 3,
}
