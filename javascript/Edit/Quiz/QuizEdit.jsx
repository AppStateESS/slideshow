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
        let initQuestion = ''
        let initAnswers = ['', '']
        let initCorrect = []
        let initType = 'showTypes'
        let initFeedback = []
        let initId = window.sessionStorage.getItem('quizId')
        
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
        /* debug
        console.log('saving quiz: ', id)
        console.log('the answers are: ', answers)
        console.log('with the correct indexes of : ', correct)
        console.log(question)
        */
       if (correct.length === 0) {
           alert("Please select a correct answer.")
           return
       }
       
        let quizContent = {
            'quizId': id,
            'question': question,
            'answers': answers,
            'correct': correct,
            'type': type
        }
        await $.ajax({
            url: './slideshow/Quiz/' + id,
            type: 'put',
            data: quizContent,
            success: async (res) => {
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
        const ids = e.target.id.split('-')
        const type = ids[0]
        const i = Number(ids[1])
        let a = [...answers]
        let c = [...correct]
        if (type == 'text') {
            a[ids[1]] = e.target.value
        }
        else if (type == 'check') {
            // This is multiple choice and there is only one correct answer
            c[0] = i
        }
        else if(type == 'select') {
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
		let choices = answers.map((choice) => {
            i++
		    let checked = correct.includes(i.toString()) || correct.includes(i)
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
			let checked = correct.includes(i.toString()) || correct.includes(i)
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