import React, { useEffect, useState } from 'react'

import AnswerTypeCards from './AnswerTypeCards.jsx'
import QuestionTitle from './QuestionTitleBlock.jsx'
import AnswerBlock from './AnswerBlock.jsx'
import SettingsModal from './AnswerSettings'

import './quiz.css'
import { saveQuiz } from '../../api/quiz.js'

import 'animate.css'
import Tippy from '@tippyjs/react'
import { Form, Modal } from 'react-bootstrap'
import Dropzone from 'react-dropzone-uploader'
import { propTypes } from 'react-bootstrap/esm/Image'
import PropTypes from "prop-types"
const { Row, Group, Check } = Form

export default function QuizEdit(props) {

  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState(['', '']) // : string[]
  const [correct, setCorrect] = useState([]) // : number[]
  const [type, setType] = useState('showTypes')
  const [feedback, setFeedback] = useState(['global', 'Correct!', 'Please try again']) // : string[]
  const [id, setId] = useState(-1)
  const [imageUrl, setImageUrl] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [feedCheck, setFeedCheck] = useState(false)

  const [animationType, setAnimation] = useState('animated slideInRight faster')


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
      initFeedCheck = (initFeedback[0] === 'local')
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
      alert("Please select a correct answer.")
      return
    } else if (type === 'choice' && feedCheck) {
      // Checks to make sure all of feeback is filled out 
      for (let i = 2; i < feedback.length; i++) {
        if (feedback[i] == undefined || feedback[i] == "") {
          alert("Please ensure that all custom answers are filled out.")
          return
        }
      }
    }

    let quizContent = {
      'quizId': id,
      'question': question,
      'answers': answers,
      'correct': correct,
      'type': type,
      'feedback': feedback,
      'imageUrl': imageUrl
    }
    const saved = await saveQuiz(id, quizContent)

    if (saved) {
      props.saveQuizContent(quizContent)
      await props.load()
    } else {
      alert("an error has occurred when saving")
    }

    props.toggle()
  }

  function handleAnswerChange(e) {
    const ids = e.target.id.split('-')
    const type = ids[0]
    const i = Number(ids[1])
    let a = [...answers]
    let c = [...correct]
    if (type == 'text') {
      a[ids[1]] = e.target.value
    }
    else if (type === 'choice') {
      // This is multiple choice and there is only one correct answer
      c[0] = i
    }
    else if (type === 'select') {
      // handle change 
      // if the is is in the array we need to remove it, if the id is not we add it
      console.log(ids)
      if (c.includes(i) || c.includes(i.toString())) {
        // remove current choice from correct
        let item = c.findIndex(index => { return index == i })
        c.splice(item, 1)
      }
      else {
        // Add new choice to correct
        c.push(i)
      }
    }

    setAnswers(a)
    setCorrect(c)
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

    let a = [...answers]
    let c = [...correct]
    let f = [...feedback]

    if (c.includes(id.toString())) {
      const index = c.indexOf(id.toString())
      c.splice(index, 1)
    }
    a.splice(id, 1)
    f.splice(id + 3, 1)
    setAnswers(a)
    setCorrect(c)
    setFeedback(f)
  }

  function toggleFeedCheck() {
    let f = [...feedback]
    let fc = (f[0] === 'local')
    if (type === 'select') {
      // This shouldn't get triggered since I remove the ui option but I will leave it here in case
      alert("Custom Local Feedback is not supported for multiple select")
      fc = true
    }
    f[0] = (fc) ? 'global' : 'local'
    setFeedback(f)
    setFeedCheck(!fc)
    setShowCustom(!fc)
  }

  function changeBackground(fileWithMeta) {
    let formData = new FormData()
    const showId = Number(window.sessionStorage.getItem('id'))
    const slideId = Number(window.sessionStorage.getItem('slideId'))
    let fMeta = fileWithMeta[0]
    formData.append('backgroundMedia', fMeta.file)
    formData.append('slideId', slideId)
    formData.append('id', showId)

    $.ajax({
      url: './slideshow/Slide/background/' + slideId,
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: (imageUrl) => {
        props.changeBackground(imageUrl)
        setImageUrl(imageUrl)
        alert('Background Image has been Inserted!')
      },
      error: (req, res) => {
        console.error(res)
        alert(
          'An error has occured with this image. Please try a different image.'
        )
      },
    })
  }

  function buildAnswerBlock(type) {
    if (type !== 'choice' && type != 'select') return undefined
    let i = -1
    let choices = answers.map((choice) => {
      i++
      let checked = correct.includes(i.toString()) || correct.includes(i)
      return <AnswerBlock
        type={type}
        key={i} id={i}
        onChange={handleAnswerChange}
        remove={removeAnswer}
        value={choice}
        checked={checked}
        custom={showCustom}
        setFeedback={(f) => setFeedback(f)}
        feedback={feedback}
      />
    })

    let bottomBlock = (
      <Row style={{ marginLeft: '10%' }}>
        <Group style={{ width: '60%', marginRight: '1rem' }}>
          <button key={'add'} className="btn btn-primary btn-block" onClick={() => addAnswer()} ><i className="fas fa-plus-circle"></i> Add Another Answer</button>
        </Group>
        <Group >
          <Tippy content={<div>Answer Settings</div>} arrow={true}>
            <span style={{ fontSize: '32px', color: 'dimgray' }} onClick={() => setShowModal(true)}><i className="fas fa-cog"></i></span>
          </Tippy>
        </Group>
        {type === 'choice' ?
          <Group>
            <Tippy content={<div>{!showCustom ? 'Show ' : 'Hide '} Custom Answer responses</div>} arrow={true}>
              <div style={{ marginLeft: 10, padding: '3px' }} onClick={() => setShowCustom(!showCustom)}>
                <span style={{ fontSize: '28px', color: 'dimgray' }}><i className="fas fa-comment-alt"></i></span>
              </div>
            </Tippy>
          </Group> : null}
        {type === 'choice' ? // Only support custom feedback on multipleChoice for now
          <Group className="flexbox-mid">
            <Check
              custom
              type='checkbox'
              id='localResponse'
              name={'localResponse'}
              checked={feedCheck}
              label="Use custom responses"
              onChange={toggleFeedCheck} />
            {/*<label>Enable Individual Custom Responses</label>*/}

          </Group> : null}
      </Row>
    )
    choices.push(bottomBlock)
    return choices
  }

  let imgModal = (
    <Modal show={props.mediaView} onHide={props.mediaCancel}>
      <Modal.Header closeButton>
        <h5>Insert Image</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="card">
          <div className="card-header text-center">Upload</div>
          <Dropzone
            accept="image/jpeg,image/png,image/gif"
            maxFiles={1}
            multiple={false}
            minSizeBytes={1024}
            maxSizeBytes={18388608}
            onChangeStatus={props.validate}
            onSubmit={props.insertMedia}
            submitButtonContent={'Insert'}
            inputContent={''}
            classNames={{
              submitButton: 'btn btn-secondary btn-block drop',
              dropzone: 'drop',
            }}
          />
        </div>
      </Modal.Body>
    </Modal>
  )

  let imageBlock = (type === 'showTypes') ?
    undefined :
    (
      <Row style={{ marginLeft: '10%' }}>
        <Group style={{ width: '60%', marginRight: '1rem' }}>
          <button style={{marginBottom: '1%'}} key={'add'} className="btn btn-primary btn-block" onClick={() => props.mediaOpen()} ><i className="fas fa-images"></i> Insert an Image</button>
          <div className="card">
            <div className="btn btn-primary btn-block"><i className="fas fa-images"></i> Insert background Image</div>
            <Dropzone
              accept="image/jpeg,image/png,image/gif"
              maxFiles={1}
              multiple={false}
              minSizeBytes={1024}
              maxSizeBytes={18388608}
              onChangeStatus={props.validate}
              onSubmit={changeBackground}
              submitButtonContent={'Insert'}
              inputContent={''}
              classNames={{
                submitButton: 'btn btn-secondary btn-block drop',
                dropzone: 'drop',
              }}
            />
          </div>
        </Group>
      </Row>
    )

  let answerTypeBlock = type === 'showTypes' ? (
    <AnswerTypeCards switchView={switchView} selectOne={correct} />
  ) : null

  let showAddElement = (type === 'showTypes') ?
    undefined :
    (<span>
      <button id='showTypes' key="2" className="btn btn-secondary btn-block" onClick={switchView}><i className="fas fa-undo"></i> Change Answer Type</button>
      <button key="3" className="btn btn-primary btn-block" onClick={save}><i className="fas fa-save"></i> Save Quiz Slide</button>
    </span>)


  const quizBuild = buildAnswerBlock(type)

  return (
    <div className={animationType} style={containerStyle}>
      <h3 style={{ textAlign: 'center' }}>Edit Quiz</h3>
      <div>
        <QuestionTitle placeholder={'Question Title'} value={question} onChange={(e) => setQuestion(e.currentTarget.value)} id={0} />
        <hr style={{ border: '1px solid', width: '50%' }}></hr>
        {quizBuild}
        {imgModal}
        {imageBlock}
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

const containerStyle = {
  padding: '20px',
  backgroundColor: '#E5E7E9',
  borderRadius: 3
}

QuizEdit.propTypes = {
  validate: PropTypes.func,
  insertMedia: PropTypes.func,
  mediaView: PropTypes.bool,
  mediaCancel: PropTypes.func,
  mediaOpen: PropTypes.func
}