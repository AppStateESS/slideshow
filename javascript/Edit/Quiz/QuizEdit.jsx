import React, { useEffect, useState } from 'react'

import AnswerTypeCards from './AnswerTypeCards.jsx'
import QuestionTitle from './QuestionTitleBlock.jsx'
import MultipleChoice from './MultipleChoiceBlock.jsx'
import MultipleSelect from './MultipleSelectBlock'

export default function QuizEdit(props) {
    
    const [question, setQuestion] = useState('')
    const [answers, setAnswers] = useState(['', '']) // : string[]
    const [correct, setCorrect] = useState([]) // : number[]
    const [type, setType] = useState('showTypes')
    const [feedback, setFeedback] = useState([]) // : string[]
    const [id, setId] = useState(-1)

    
    useEffect(() => {
        setId(window.sessionStorage.getItem('quizId'))
        //dont forget to clear correct answers when switching types
        /*$.ajax({
            url: './slideshow/Quiz/' + id,
            type: 'get',
            success: (data) => {
                console.log(data)
            }
        })*/
        console.log(props)
        let initQuestion = ''
        let initAnswers = ['', '']
        let initCorrect = []
        let initType = 'showTypes'
        let initFeedback = []
        let initId = -1
        
        if (props.quizContent != null) {
            // Hooks are not allowed to be called in conditonals which is why there is this horrible code structure here
            initQuestion = props.quizContent.question
            initAnswers = props.quizContent.answers
            initCorrect = props.quizContent.correct
            initType = props.quizContent.type
            initFeedback = props.quizContent.answerFeedback
            initId = props.quizContent.quizId
        }
        setQuestion(initQuestion)
        setAnswers(initAnswers)
        setCorrect(initCorrect)
        setType(initType)
        setFeedback(initFeedback)
        setId(initId)
    }, [])

    /* Used for debugging
    useEffect(() => {
        console.log(answers)
        console.log(correct)
    }, [answers, correct])
    */
   useEffect(() => {
       console.log(question)
   }, [question])

    async function save() {
        console.log('saving quiz: ', id)
        console.log('the answers are: ', answers)
        console.log('with the correct indexes of : ', correct)
        console.log(question)
        /*let formData = new FormData()
        formData.append('quizId', id)
        formData.append('questionTitle', question)
        formData.append('answers', answers)
        formData.append('correct', correct)
        formData.append('type', type)*/
        let quizContent = {
            'quizId': id,
            'question': question,
            'answers': answers,
            'correct': correct,
            'type': type
        }
        //formData.append('answerFeedback', feedback)
        await $.ajax({
            url: './slideshow/Quiz/' + id,
            type: 'put',
            data: quizContent,
            //contentType: false,
            //processData: false,
            success: async (res) => {
                console.log("saved successfully")
                console.log(res)
                await props.load()
                //props.toggle()
            },
            error: (req, res) => {
                console.log(req)
                console.error(res)
            }
        })
        props.toggle()
    }

    function handleAnswerChange(e) {
        let ids = e.target.id.split('-')
        let a = [...answers]
        let c = [...correct]
        if (ids[0] == 'text') {
            a[ids[1]] = e.target.value
        }
        else if (ids[0] == 'check') {
            // This is multiple choice and there is only one correct answer
            c[0] = Number(ids[1])
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
        // Note: When deleting an element that is above a slected correct answer
        // The correct answer will not move with the element. It will stay at it's current index
        console.log(id)
        let a = [...answers]
        let c = [...correct]
        // TODO: work needs to be done on this to make it work as expected
        if (c.includes(id)) {
            // this is for muliple choice. This will need to be changed with multiple select
            c = []
        }
        a.splice(id,1)
        setAnswers(a)
        setCorrect(c)
    }

    function buildChoiceBlock() {
        let i = -1
        console.log(correct)
		let choices = answers.map((choice) => {
            i++
		    let checked = correct.includes(i)
			return <MultipleChoice key={i} id={i} onChange={handleAnswerChange} remove={removeAnswer} value={choice} checked={checked} />
		})
		choices.push(<button key={'add'} className="btn btn-primary btn-block" onClick={() => addAnswer()} style={{ marginBottom: '2rem', marginLeft: '10%', width: '54%' }}><i className="fas fa-plus-circle"></i> Add Another Answer</button>)
		return choices
    }
    
    // we aren't actually using this right now
    /*
    function buildOpenBlock() {
		let i = -1
		let choices = this.state.quizContent.openAnswer.map((choice) => {
			i++
			return <OpenAnswer key={i} id={i} onChange={this.updateQuizContent} value={choice} />
		})
		return choices
	} */

	function buildMultipleSelectBlock() {
		let i = -1
		let choices = answers.map((choice) => {
			i++
			let checked = correct.includes(i)
			return <MultipleSelect key={i} id={i} onChange={handleAnswerChange} remove={removeAnswer} value={choice} checked={checked} />
		})
		choices.push(<button key={'add'} className="btn btn-primary btn-block" onClick={addAnswer} style={{ marginBottom: '2rem', marginLeft: '10%', width: '54%' }}><i className="fas fa-plus-circle"></i> Add Another Answer</button>)
		return choices
    }
    
    

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

    return (
        <div>
            <h3 style={{ textAlign: 'center', marginTop: -40 }}>Edit Quiz</h3>
            <div>
                <QuestionTitle placeholder={'Question Title'} value={question} onChange={(e)=>setQuestion(e.currentTarget.value)} id={0} />
                <hr style={{ border: '1px solid', width: '50%' }}></hr>
                {quizBuild}
				{answerTypeBlock}
				{showAddElement}
            </div>
        </div>
    )

}