'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const DecisionForm = ({decision, update, save, deleteDecision,}) => {

  const updateTitle = (e) => {
    decision.title = e.target.value
    update(decision)
  }

  const updateMessage = (e) => {
    decision.message = e.target.value
    update(decision)
  }
  
  const updateNext = () => {
    decision.next = decision.next == '1' ? '0' : '1'
    update(decision)
  }

  return (
    <div className="well">
      <label>Question</label>
      <input
        type="text"
        className="form-control"
        value={decision.title}
        onChange={updateTitle}/>
      <label>Response message</label>
      <textarea
        value={decision.message}
        className="form-control"
        onChange={updateMessage}/>
      <label><input type="checkbox" value="1" checked={decision.next == '1'} onChange={updateNext}/>&nbsp;Allow to continue
      </label>
      <div>
        <button className="btn btn-primary marginRight" onClick={save}>Save</button>
        <button className="btn btn-danger" onClick={deleteDecision}>Delete</button>
      </div>
    </div>
  )
}

DecisionForm.propTypes = {
  update: PropTypes.func,
  decision: PropTypes.object,
  save: PropTypes.func,
  delete: PropTypes.func
}

export default DecisionForm
