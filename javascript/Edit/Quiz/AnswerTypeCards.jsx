'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Card,
  Button,
  Row
} from 'react-bootstrap'


export default class AnswerTypeCards extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="row" style={{margin: 10}}>
        <div className="col">
          <div className="card text-center text-white bg-secondary">
            <div className="card-header">Multiple Choice</div>
            <div className="card-body">
              <p className="card-text">Multiple choice options with one possible correct answer</p>
              <br></br>
              <button className="btn btn-primary btn-block" id="choice" onClick={this.props.switchView}>Select</button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center text-white bg-secondary">
            <div className="card-header">Open Answer</div>
            <div className="card-body">
              <p className="card-text">Open answer field for user's open response</p>
              <br></br>
              <button className="btn btn-primary btn-block" id="open" onClick={this.props.switchView}>Select</button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center text-white bg-secondary">
            <div className="card-header">Multiple Select</div>
            <div className="card-body">
              <p className="card-text">Multiple choice options with one or more possible correct answer(s)</p>
              <button className="btn btn-primary btn-block" id="select" onClick={this.props.switchView}>Select</button>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}

AnswerTypeCards.propTypes = {
  openAnswer: PropTypes.func,
  multipleChoice: PropTypes.func,
  multipleSelect: PropTypes.func
}
