import React, { useEffect, useState } from 'react'
import {Form} from 'react-bootstrap'

import AnswerTypeCards from './AnswerTypeCards.jsx'
import QuestionTitle from './QuestionTitleBlock.jsx'
import MultipleChoice from './MultipleChoiceBlock.jsx'
import OpenAnswer from './OpenAnswerBlock.jsx'
import MultipleSelect from './MultipleSelectBlock'

export default function QuizEdit(props) {
    
    const [question, setQuestion] = useState('Question title')
    const [answers, setAnswers] = useState(['', ''])
    const [correct, setCorrect] = useState([])
    const [type, setType] = useState('showTypes')
    const [feedback, setFeedback] = useState([])
    const [id, setId] = useState(-1)

    
    useEffect(() => {
        setId(window.sessionStorage.getItem('quizId'))
        //dont forget to clear correct answers when switching types
        $.ajax({
            url: './slideshow/Quiz/' + id,
            type: 'get',
            success: (data) => {
                console.log(data)
            }
        })

    }, [])

    function save() {
        console.log('saved')
    }

    function handleAnswerChange(e) {
        console.log(e.target.value)
    }

    function switchView(e) {
        e.preventDefault()
        console.log(e.target.id)
        setType(e.target.id)
    }

    function buildChoiceBlock() {
		let i = -1
		let choices = answers.map((choice) => {
			i++
			let checked = false
			if (correct != undefined) {
				checked = correct.includes(i.toString())
			}
			return <MultipleChoice key={i} id={i} onChange={handleAnswerChange} /*remove={this.remove} value={choice} checked={checked} *//>
		})
		choices.push(<button key={'add'} className="btn btn-primary btn-block" /*onClick={addAnswer}*/ style={{ marginBottom: '2rem', marginLeft: '10%', width: '54%' }}><i className="fas fa-plus-circle"></i> Add Another Answer</button>)
		return choices
    }
    
    //we aren't actually using this right now
    /*
    function buildOpenBlock() {
		let i = -1
		let choices = this.state.quizContent.openAnswer.map((choice) => {
			i++
			return <OpenAnswer key={i} id={i} onChange={this.updateQuizContent} value={choice} />
		})
		return choices
	}

	function buildMultipleSelectBlock() {
		let i = -1
		let choices = answers.map((choice) => {
			i++
			let checked = (correct.includes(i.toString()))
			return <MultipleSelect key={i} id={i} onChange={this.updateQuizContent} remove={this.remove} value={choice} checked={checked} />
		})
		choices.push(<Button key={'add'} variant="primary" onClick={this.addAnswer} style={{ marginBottom: '2rem', marginLeft: '10%', width: '54%' }} block><i className="fas fa-plus-circle"></i> Add Another Answer</Button>)
		return choices
    }
    
    */

    let answerTypeBlock = type === 'showTypes' ? (
        <AnswerTypeCards switchView={switchView} selectOne={correct} />
    ) : null

    let showAddElement = /*this.state.addElementVisible ||*/ type === 'showTypes' ?
        undefined :
        <span>
            <button id='showTypes' key="2" className="btn btn-secondary btn-block" onClick={switchView}><i className="fas fa-undo"></i> Change Answer Type</button>
            <button key="3" className="btn btn-primary btn-block" onClick={save}><i className="fas fa-save"></i> Save Quiz Slide</button>
        </span>

    let quizBuild = undefined
    if (type === 'choice') {
        quizBuild = buildChoiceBlock()
    }
    else if (type === 'select') {
        quizBuild = buildMultipleSelectBlock()
    }


    //let quizBuild = undefined
    //let answerTypeBlock = undefined
    //let showAddElement = undefined
    return (
        <div>
            <h3 style={{ textAlign: 'center', marginTop: -40 }}>Edit Quiz</h3>
            <Form>
                <QuestionTitle value={question} onChange={(e)=>setQuestion(e.target.currentValue)} id={0} />
                <hr style={{ border: '1px solid', width: '50%' }}></hr>
                {quizBuild}
				{answerTypeBlock}
				{showAddElement}
            </Form>
        </div>
    )

}