'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Row,
  Col,
  Card
} from 'react-bootstrap'

export default class OpenAnswerBlock extends Component {
  constructor() {
    super()
    this.state = {
      placeholder: null
    }
  }

  componentDidMount() {
    let place = this.props.placeholder
    if (place == null) {
      place = "Students will put their answer here. If their answer should be graded on correctness, then select the checkbox on the right."
    }
    this.setState({
      placeholder: place
    })
  }

  render() {
    return (
      <span key={'openAnswerBlock'}>
      <Form.Row style={{padding: '1rem'}}>
        <Form.Group controlId={'opentext-' + this.props.key} style={{width: '25rem', marginRight: '1rem'}}>
          <Form.Label >Open Answer</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            placeholder={this.state.placeholder}
            onChange={this.props.onChange}
            value={this.props.value}/>
        </Form.Group>
        <Form.Group id={'openOptions-' + this.props.key}>
          <Form.Label>Options</Form.Label>
          <Form.Check
            type='checkbox'
            id={'check-' + this.props.key}
            label='Enable keyed-answer'
            onChange={this.props.onChange}/>
        </Form.Group>
      </Form.Row>
    </span>
    )
  }
}

OpenAnswerBlock.propType = {
  key: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.value
}
