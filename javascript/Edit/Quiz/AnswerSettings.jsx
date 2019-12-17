import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import Tippy from '@tippy.js/react'

const {Header, Body, Footer} = Modal

export default function AnswerSettings(props) {

    const {feedback, setFeedback} = props

    const [localEnable, setLocalEnable] = useState(false)

    useEffect(() => {
        let disable = false
        if (feedback[0] === 'local') {
            disable = true
        }
        setLocalEnable(disable)
    }, [feedback])

    async function save() {
        // I have this a seperate function for the case we add more settings here
        // that we may want to save seperatly.
        await saveFeedback()
        // Other settings to be saved...
        props.onHide()
    }

    async function saveFeedback() {
        // TODO: We should probs do an ajax, but I was thinking we could just call the parent saveDb function
        // But for right now, it will just be saved to the state and when editQuiz is cloesed the feedback will be saved.
        console.log("Saving settings")
    }

    function handleChange(e) {
        // I'm not sure the iterator spread is necessary but from my pointer ptsd imma do it anyway lmao 
        let f = [...feedback]
        f[0] = 'global'
        if (e.currentTarget.id === 'onCorrect') {
            f[1] = e.currentTarget.value
        }
        else if (e.currentTarget.id === 'onIncorrect') {
            f[2] = e.currentTarget.value
        }
        setFeedback(f)
    }

    const handleGlobal = function(e) {
        console.log("test")
        props.toggleGlobal()
        setLocalEnable(!localEnable)
    }

    const answerFeedbackHelp = (
        <div>
            Allows for custom feedback to be displayed to the user when submititing an answer.
            <br></br> 
            If they choose the correct answer the on-correct message will appear and vice-versa
            <br></br>
            These will not appear if the local custom answer responses are enabled and filled out
        </div>
    )

    return (
       <Modal onHide={props.onHide} show={props.show} size="lg" centered>
            <Header closeButton>
                <h4>Answer Settings</h4>
            </Header>
            <Body>
            <div>
                <h5>Generic Answer Responses <Tippy content={answerFeedbackHelp} arrow={true}><span><i className="fas fa-question-circle" style={{color: 'gray'}}></i></span></Tippy></h5>
                <div className="custom-control custom-checkbox my-1 mr-sm-2" onClick={handleGlobal}>
                    <input type="checkbox" className="custom-control-input" id="customControlInline" checked={!localEnable} />
                    <label className="custom-control-label" >Enable Generic Responses</label>
                </div>
                <hr></hr>
                <div className="input-group mb-4">
                    <div className="input-group-prepend">
                        <Tippy content={<div>On Correct</div>} arrow={true}>
                        <span className="input-group-text" style={{width: 40}}><i className="fas fa-check" style={{color: 'green'}}></i></span>
                        </Tippy>
                    </div>
                    <textarea className="form-control" id="onCorrect" rows="2" onChange={handleChange} value={feedback[1]} disabled={localEnable}></textarea>
                </div>
                <div className="input-group mb-4">
                <div className="input-group-prepend">
                        <Tippy content={<div>On Incorrect</div>} arrow={true}>
                        <span className="input-group-text" style={{width: 40}}><i className="fas fa-times" style={{marginLeft: 3, color: '#d9534f'}}></i></span>
                        </Tippy>
                    </div>
                    <textarea className="form-control" id="onIncorrect" rows="2" onChange={handleChange} value={feedback[2]} disabled={localEnable}></textarea>
                </div>
            </div>
            </Body>
            <Footer>
                <button type="button" className="btn btn-primary btn-block" onClick={save}>Apply</button>
            </Footer>
        </Modal>
    )
}