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
      <div style={{ padding: 10 }}>
        <Row style={{ padding: 10, justifyContent: 'center' }} >
          <Card bg="secondary" text="white" style={{ width: '12rem', marginRight: '1rem' }}>
            <Card.Header>Multiple Choice</Card.Header>
            <Card.Body>
              <Card.Text>
                Multiple answers for students to choose from with one correct.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button id={'choice'} onClick={this.props.switchView}>Select</Button>
            </Card.Footer>
          </Card>
          <Card bg="secondary" text="white" style={{ width: '12rem', marginRight: '1rem' }}>
            <Card.Header>Open Answer</Card.Header>
            <Card.Body>
              <Card.Text>
                Open text field for students to write a response.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button id={'open'} onClick={this.props.switchView}>Select</Button>
            </Card.Footer>
          </Card>
          <Card bg="secondary" text="white" style={{ width: '12rem' }}>
            <Card.Header>Multiple-Select Choice</Card.Header>
            <Card.Body>
              <Card.Text>
                Allow studetns to select multiple options from a multiple-choice set using radio buttons.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button id={'select'} onClick={this.props.switchView}>Select</Button>
            </Card.Footer>
          </Card>
        </Row>
      </div>
    )
  }
}

AnswerTypeCards.propTypes = {
  openAnswer: PropTypes.func,
  multipleChoice: PropTypes.func,
  multipleSelect: PropTypes.func
}
