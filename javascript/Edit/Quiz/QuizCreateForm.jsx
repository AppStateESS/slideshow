'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Row,
  Col,
  Card
} from 'react-bootstrap'

import AnswerTypeCards from './AnswerTypeCards.jsx'
import QuestionTitle from './QuestionTitleBlock.jsx'
import MultipleChoice from './MultipleChoiceBlock.jsx'
import OpenAnswer from './OpenAnswerBlock.jsx'


export default class QuizCreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quizContent: {
        questionTitle: '',
        answers: [],
        correctAnswerIndex: 0,
        questionType: null
      }, // Local state ("js object") for quiz data
      formContent: [(
        <QuestionTitle key={'questionTitle'} id={0} onChange={this.updateQuizContent.bind(this)} />
      )], // The structure to recieve quiz data that will be saved.
      answerTypesVisible: true, // Responsible for the switch that shows the answer types
      addElementVisible: true, // when false then removeElement will show
      multipleChoices: [(
        <MultipleChoice key={0} id={0} onChange={this.updateQuizContent.bind(this)} value={''} remove={this.removeAnswerChoice}/>
        ),(
        <MultipleChoice key={1} id={1} onChange={this.updateQuizContent.bind(this)} value={''} remove={this.removeAnswerChoice}/>
        ),
      // More will be added on insert.
      ],
      uniqueIdLength: 2 // This keeps track of the elements in multipleChoices so we dont mix up indexes if something gets deleted.
    }

    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.cancel = this.cancel.bind(this)
    this.updateQuizContent = this.updateQuizContent.bind(this)
    this.toggleAnswerTypes = this.toggleAnswerTypes.bind(this)
    this.insertMultipleChoiceBlock = this.insertMultipleChoiceBlock.bind(this)
    this.insertOpenAnswerBlock = this.insertOpenAnswerBlock.bind(this)
    this.removeAnswerBlock = this.removeAnswerBlock.bind(this)
    this.insertAnswerChoice = this.insertAnswerChoice.bind(this)
    this.removeAnswerChoice = this.removeAnswerChoice.bind(this)
    this.updateAnswerChoices = this.updateAnswerChoices.bind(this)
  }

  componentDidMount() {
    if (this.props.quizContent != undefined) {
      this.setState({quizContent: JSON.parse(this.props.quizContent)}, () => {
        this.load()
      })
    }
  }

  save() {

    let nqContent = Object.assign({}, this.state.quizContent)

    if (this.state.quizContent.questionType == 'mc') {
      // remove null values
      // reference array
      let qContent = Object.assign({}, this.state.quizContent)
      nqContent.answers = qContent.answers.filter(function(answer) {
        return answer != null
      })
    }
    // save answers
    this.props.saveQC(JSON.stringify(nqContent))
    // save slide show
    this.props.saveDB()
  }

  load() {
    /* Loads data from props and builds the initial form structure, if it exists */

    let qContent = this.state.quizContent
    let formC = [(<QuestionTitle key={'questionTitle'} id={0} value={qContent.questionTitle} onChange={this.updateQuizContent}/>)]

    if (qContent.questionType == 'mc') {
        // Build multiple-choice block with data inserted
        // Add mcBlock to formContent array
        let mChoices = []
        let i = 0
        for (var i = 0; i < qContent.answers.length; i++) {
          mChoices.splice(qContent.answers.length - 1, 0,
            <MultipleChoice key={i} id={i} onChange={this.updateQuizContent} value={qContent.answers[i]} remove={this.removeAnswerChoice}/>
          )
        }
        let mcBlock = (<span key={'multipleChoicesBlock'}>
          <fieldset>
            <Form.Group as={Row}>
              <Col>
                <Form.Label>Answers</Form.Label>
                {mChoices}
              </Col>
            </Form.Group>
          </fieldset>
          <Button variant="primary" onClick={this.insertAnswerChoice} style={{marginBottom: 5}}><i className="fas fa-plus-circle"></i> Add Another Answer</Button>
        </span>)
        formC.splice(1, 0, mcBlock)

        this.setState({
          formContent: formC,
          multipleChoices: mChoices,
          addElementVisible: false,
          answerTypesVisible: false,
          uniqueIdLength: qContent.answers.length
        })
    }
    else if (qContent.questionType == 'open') {
      // build formContent array with data
      let open = <OpenAnswer key={0} onChange={this.updateQuizContent} placeholder={qContent.answers[0]} />
      formC.splice(1, 0, open)

      this.setState({
        formContent: formC,
        addElementVisible: false,
        answerTypesVisible: false
      })
    }
    else {
      // TODO: Handle this.
      // Also will need one for true/false and multiple-select or any other types of questions
      console.log("undefined type")
      console.log(this.state.quizContent)
      this.setState({
        formContent: formC
      })
    }
  }

  updateQuizContent(event) {
    /* updates the state quizContent with data passed in by an event */

    let newQuizContent = Object.assign({}, this.state.quizContent)
    const ids = event.target.id.split('-')
    if (ids[0] == 'text') {
      newQuizContent.answers[ids[1]] = event.target.value
    }
    else if (ids[0] == 'check') {
      newQuizContent.correctAnswerIndex = ids[1]
      //this.updateAnswerChoices(this.state.multipleChoices)
    }
    else if (ids[0] == 'title') {
      newQuizContent.questionTitle = event.target.value
    }

    this.setState({
      quizContent: newQuizContent
    })
  }

  toggleAnswerTypes() {
    this.setState({
      answerTypesVisible: !this.state.answerTypesVisible
    })
  }

  removeAnswerBlock() {
    let formC = [...this.state.formContent]
    formC.pop()
    this.setState({
      formContent: formC,
      addElementVisible: true,
      answerTypesVisible: true
    })
  }

  insertMultipleChoiceBlock() {
    // I don't think this if is needed anymore
    if (this.state.answerTypesVisible) {
      this.toggleAnswerTypes()
    }
    let choiceCount = 1
    let choiceBlock = (
      undefined
    )
    let choices = [choiceBlock]
    const newBlockContent = (
      <span key={'multipleChoicesBlock'}>
        <fieldset>
          <Form.Group as={Row}>
            <Col>
              <Form.Label>Answers</Form.Label>
              {this.state.multipleChoices}
            </Col>
          </Form.Group>
        </fieldset>
        <Button variant="primary" onClick={this.insertAnswerChoice} style={{marginBottom: '2rem'}}><i className="fas fa-plus-circle"></i> Add Another Answer</Button>
      </span>
    )

    let formC = this.state.formContent
    formC.push(newBlockContent)
    let qContent = this.state.quizContent
    qContent.questionType = 'mc'
    this.setState({
      formContent: formC,
      addElementVisible: false,
      quizContent: qContent
    })

  }

  insertOpenAnswerBlock() {
    this.toggleAnswerTypes()
    const newBlockContent = <OpenAnswer key={1} onChange={this.updateQuizContent} />


    let formC = this.state.formContent
    formC.push(newBlockContent)
    let qContent = this.state.quizContent
    this.setState({
      formContent: formC,
      addElementVisible: false,
      quizContent: qContent

    }, () => {
      console.log("Not yet implement")
      console.log(this.state.formContent)
    })

  }

  insertAnswerChoice() {
    /* Inserts another multiple choice option */
    let choices = [...this.state.multipleChoices]
    let key = this.state.uniqueIdLength
    choices.splice(key, 0,
      <MultipleChoice key={key} id={key} value={''} onChange={this.updateQuizContent} remove={this.removeAnswerChoice} />
    )

    this.setState({
      uniqueIdLength: this.state.uniqueIdLength +=1
    })
    this.updateAnswerChoices(choices)
  }

  removeAnswerChoice(index) {
    /* Removes a multiple choice option */

    let choices = [...this.state.multipleChoices]
    // remove the choice
    choices[index] = undefined
    let qContent = Object.assign({}, this.state.quizContent)
    qContent.answers[index] = null
    this.setState({
      quizContent: qContent
    })

    this.updateAnswerChoices(choices)
  }

  updateAnswerChoices(choices) {
    /* Takes a choices array and wraps them into a renderable component within formContent */

    let formC = [...this.state.formContent]
    formC.pop()

    let formBlock = (
      <span key={'multipleChoicesBlock'}>
        <fieldset>
          <Form.Group as={Row}>
            <Col>
              <Form.Label>Answers</Form.Label>
              {choices}
            </Col>
          </Form.Group>
        </fieldset>
        <Button variant="primary" onClick={this.insertAnswerChoice} style={{marginBottom: '2rem'}}><i className="fas fa-plus-circle"></i> Add Another Answer</Button>
      </span>
    )

    formC.splice(1, 0, formBlock)
    this.setState({
      multipleChoices: choices,
      formContent: formC
    })
  }

  cancel() {
    alert("Your progress will not be saved")
    this.props.toggle()
  }

  render() {
    let answerTypeBlock = this.state.answerTypesVisible ? (
      <AnswerTypeCards openAnswer={this.insertOpenAnswerBlock} multipleChoice={this.insertMultipleChoiceBlock}/>
    ) : null

    let showAddElement = this.state.addElementVisible ?
      //<Button key="1" variant="primary" onClick={this.toggleAnswerTypes} block><i className="fas fa-plus-circle"></i> Insert Quiz Element</Button> :
      undefined :
      <span>
        <Button key="2" variant="secondary" onClick={this.removeAnswerBlock} block><i className="fas fa-undo"></i> Change Answer Type</Button>
        <Button key="3" variant="primary" onClick={this.save} block><i className="fas fa-save"></i> Save Quiz Slide</Button>
      </span>

    return (
      <Form >
        <h3>New Quiz:</h3>
        { this.state.formContent.map(component => (component)) }
        {answerTypeBlock}
        {showAddElement}
        <div style={{marginTop: '1rem'}}>
          <Button variant="outline-secondary" onClick={this.cancel} block><i className="fas fa-times-circle"></i> Cancel</Button>
        </div>
      </Form>
    )
  }
}

QuizCreateForm.propTypes = {
  quizContent: PropTypes.string,
  saveQC: PropTypes.func,
  toggle: PropTypes.func,
  saveDB: PropTypes.func,
}
