'use strict'
import React from 'react'

export default function QuizToolbar(props) {

  const edit = (<button key="edit" className="btn btn-outline-primary btn-block" style={{ marginTop: 3 }} onClick={props.toggleQuizEdit}>
    <i className="fas fa-edit"></i> Edit Quiz Slide</button>)

  const cancel = (<button key="cancel" className="btn btn-outline-secondary btn-block"style={{ marginTop: 3 }} onClick={props.toggleQuizEdit}>
    <i className="far fa-window-close"></i> Close Edit Without Saving</button>)

  return (
    <div>
      {props.view ? cancel : edit}
    </div>
  )
}