'use strict'
import React, { Component } from 'react'
import {
	Form,
	Button
} from 'react-bootstrap'

import AnswerTypeCards from './AnswerTypeCards.jsx'
import QuestionTitle from './QuestionTitleBlock.jsx'
import MultipleChoice from './MultipleChoiceBlock.jsx'
import OpenAnswer from './OpenAnswerBlock.jsx'
import MultipleSelect from './MultipleSelectBlock'
import MultipleChoiceBlock from './MultipleChoiceBlock.jsx';

export default class QuizEdit extends Component {
	constructor(props) {
		super(props)
		this.state = {
			quizContent: {
				questionTitle: '',
				answers: ['', ''],
				openAnswer: [''],
				correctAnswers: [],
				questionType: null
			},
			view: ''
		}
		this.save = this.save.bind(this)
		this.remove = this.remove.bind(this)
		this.updateQuizContent = this.updateQuizContent.bind(this)
		this.switchView = this.switchView.bind(this)
		this.addAnswer = this.addAnswer.bind(this)
		this.buildChoiceBlock = this.buildChoiceBlock.bind(this)
		this.buildOpenBlock = this.buildOpenBlock.bind(this)
		this.buildMultipleSelectBlock = this.buildMultipleSelectBlock.bind(this)
	}

	componentDidMount() {
		if (this.props.quizContent != undefined) {
			let view = 'showTypes'
			let cAnswers = this.props.quizContent.correctAnswers
			if (this.props.quizContent != null) {
				view = this.props.quizContent.questionType
				if (view == 'choice') {
					cAnswers = []
				}
			}
			this.setState({
				quizContent: this.props.quizContent,
				view: view,
				correctAnswers: cAnswers
			})
		}
		else {
			this.setState({view: 'showTypes'})
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// This dumps the choices that have been previously chosen when switching to choice 
		if (this.state.view === 'choice' && prevState.view === 'showTypes') {
			let qContent = Object.assign({}, this.state.quizContent)
			qContent.correctAnswers = []
			this.setState({quizContent: qContent})
		}
	}

	save() {
		let nqContent = Object.assign({}, this.state.quizContent)

		if (this.state.view == 'choice') {
			if (this.state.quizContent.correctAnswers == undefined || this.state.quizContent.correctAnswers === []
				|| nqContent.correctAnswers == false) {
				alert('Please select a correct answer')
				return
			}
			// remove null values
			// reference array
			let qContent = Object.assign({}, this.state.quizContent)
			nqContent.answers = qContent.answers.filter(function (answer) {
				return answer != null
			})
		}
		else if (this.state.view == 'open') {
			let qContent = Object.assign({}, this.state.quizContent)
			nqContent.answers = qContent.answers.filter(function (answer) {
				return answer != null
			})
		}
		else if (this.state.view == 'select') {
			if (this.state.quizContent.correctAnswers == undefined || this.state.quizContent.correctAnswers === []
				|| nqContent.correctAnswers == false) {
				alert('Please select a correct answer(s)')
				return
			}
			let qContent = Object.assign({}, this.state.quizContent)
			nqContent.correctAnswers = qContent.correctAnswers.filter(function (answer) {
				return answer != null
			})
		}
		// save answers
		this.props.saveQC(nqContent)
		// save slide show
		this.props.saveDB()
	}

	remove(index) {
		/* Removes a multiple choice option */
		let qContent = Object.assign({}, this.state.quizContent)
		qContent.answers.splice(index, 1)
		if (qContent.correctAnswers.includes(index.toString())) {
			qContent.correctAnswers.splice(qContent.correctAnswers.indexOf(index.toString()), 1)
		}
		this.setState({
			quizContent: qContent
		})
	}

	updateQuizContent(event) {
		/* updates the state quizContent with data passed in by an event */

		let newQuizContent = Object.assign({}, this.state.quizContent)
		const ids = event.target.id.split('-')
		if (ids[0] == 'text') {
			newQuizContent.questionType = this.state.view
			newQuizContent.answers[ids[1]] = event.target.value
		}
		else if (ids[0] == 'opentext') {
			newQuizContent.questionType = 'open'
			newQuizContent.openAnswer[ids[1]] = event.target.value
		}
		else if (ids[0] == 'check') {
			newQuizContent.questionType = 'choice'
			newQuizContent.correctAnswers = []
			newQuizContent.correctAnswers[0] = ids[1]
		}
		else if (ids[0] == 'select') {
			newQuizContent.questionType = 'select'
			let index = 0
			if (newQuizContent.correctAnswers == undefined) {
				newQuizContent.correctAnswers = []
			} else {
				index = newQuizContent.correctAnswers.length - 1
			}
			if (newQuizContent.correctAnswers.includes(ids[1])) {
				let i = newQuizContent.correctAnswers.findIndex(index => { return index == ids[1] })
				newQuizContent.correctAnswers.splice(i, 1)
			}
			else {
				newQuizContent.correctAnswers.splice(index, 0, ids[1])
			}
		}
		else if (ids[0] == 'title') {
			newQuizContent.questionTitle = event.target.value
		}

		this.setState({
			quizContent: newQuizContent
		})
	}

	switchView(event) {
		this.setState({
			view: event.target.id,

		})
	}

	addAnswer() {
		let qContent = Object.assign({}, this.state.quizContent)
		qContent.answers.push(' ')
		this.setState({
			quizContent: qContent
		})
	}

	buildChoiceBlock() {
		let i = -1
		let choices = this.state.quizContent.answers.map((choice) => {
			i++
			let checked = false
			if (this.state.quizContent.correctAnswers != undefined) {
				checked = this.state.quizContent.correctAnswers.includes(i.toString())
			}
			return <MultipleChoice key={i} id={i} onChange={this.updateQuizContent} remove={this.remove} value={choice} checked={checked} />
		})
		choices.push(<Button key={'add'} variant="primary" onClick={this.addAnswer} style={{ marginBottom: '2rem' }}><i className="fas fa-plus-circle"></i> Add Another Answer</Button>)
		return choices
	}

	buildOpenBlock() {
		let i = -1
		let choices = this.state.quizContent.openAnswer.map((choice) => {
			i++
			return <OpenAnswer key={i} id={i} onChange={this.updateQuizContent} value={choice} />
		})
		return choices
	}

	buildMultipleSelectBlock() {
		let i = -1
		let choices = this.state.quizContent.answers.map((choice) => {
			i++
			let checked = (this.state.quizContent.correctAnswers.includes(i.toString()))
			return <MultipleSelect key={i} id={i} onChange={this.updateQuizContent} remove={this.remove} value={choice} checked={checked} />
		})
		choices.push(<Button key={'add'} variant="primary" onClick={this.addAnswer} style={{ marginBottom: '2rem' }}><i className="fas fa-plus-circle"></i> Add Another Answer</Button>)
		return choices
	}

	render() {
		let answerTypeBlock = this.state.view === 'showTypes' ? (
			<AnswerTypeCards switchView={this.switchView} selectOne={this.state.quizContent.correctAnswers} />
		) : null

		let showAddElement = this.state.addElementVisible ?
			undefined :
			<span>
				<Button id='showTypes' key="2" variant="secondary" onClick={this.switchView} block><i className="fas fa-undo"></i> Change Answer Type</Button>
				<Button key="3" variant="primary" onClick={this.save} block><i className="fas fa-save"></i> Save Quiz Slide</Button>
			</span>

		let quizBuild = undefined
		if (this.state.view === 'choice') {
			quizBuild = this.buildChoiceBlock()
		}
		else if (this.state.view === 'open') {
			quizBuild = this.buildOpenBlock()
		}
		else if (this.state.view === 'select') {
			quizBuild = this.buildMultipleSelectBlock()
		}
		let title = this.state.quizContent.questionTitle
		return (
			<Form>
				<h3>New Quiz:</h3>
				<QuestionTitle value={title} onChange={this.updateQuizContent} id={0} />
				{quizBuild}
				{answerTypeBlock}
				{showAddElement}
			</Form>
		)
	}
}