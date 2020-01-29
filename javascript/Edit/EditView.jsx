import React, { useState, useEffect } from 'react'

import QuizEdit from './Quiz/QuizEdit.jsx'
import QuizView from './Quiz/QuizView.jsx'
import Editor from './DraftEditor'
import ToolbarQ from './Toolbar/QuizToolbar.jsx'


export default function EditView(props) {

    const [editView, setEditView] = useState(false)
    const [mediaAlign, setMediaAlign] = useState('right')

    let imgRender = undefined // Note This does nothing for now, but when we want to add support for images on quizzes this will be here.
    if (!props.content.isQuiz) return <Editor key={props.currentSlide} content={props.content} saveContentState={props.saveContentState} currentSlide={props.currentSlide} saveMedia={props.saveMedia} removeMedia={props.removeMedia}/>
    if (editView || props.content.quizContent == null) return (
        <div className="col" style={{marginTop: 12}}>
            <ToolbarQ toggleQuizEdit={() => setEditView(!editView)} view={editView} />
            <span id="space_between_the_toolbar" style={{padding: 1}} ></span>
            <QuizEdit quizContent={props.content.quizContent} saveQuizContent={props.saveQuizContent} toggle={() => setEditView(false)} load={props.load}/>
        </div>)
    return (
        <div className="col" style={{ paddingTop: 12}}>
            <div style={{minWidth: 700}}>
                <ToolbarQ toggleQuizEdit={() => setEditView(!editView)} view={editView} />
                <span id="space_between_the_toolbar" style={{padding: 1}} ></span>
                <div id="editor" data-key={props.currentSlide} className="jumbotron" style={{ minHeight: 500, minWidth: 300, height: '8rem', backgroundColor: props.content.backgroundColor, overflow:'auto'}}>
                    <div className="row">
                    {(mediaAlign === 'left') ? imgRender : undefined}
                    <div className="col">
                        <QuizView quizContent={props.content.quizContent} toggle={() => setEditView(true)}/>
                    </div>
                    {(mediaAlign === 'right') ? imgRender : undefined}
                    </div>
                </div>
            </div>
        </div>
    )
}