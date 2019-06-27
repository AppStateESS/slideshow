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
  constructor(props) {
    super(props)
    this.state = {
      placeholder: null,
      id: props.id,
      value: props.value
    }
    this.onChangeValue = this.onChangeValue.bind(this)
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

  onChangeValue(event) {
    this.setState({
      value: event.target.value
    })
    this.props.onChange(event)
  }

  render() {
    return (

      <Form.Row key={'row-' + this.props.id} id={this.props.id} style={{ padding: '1rem' }} >
        <Form.Group controlId={'opentext-' + this.props.id} style={{ width: '25rem', marginRight: '1rem' }}>
          <Form.Label >Open Answer</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            onChange={this.onChangeValue}
            value={this.state.value} />
        </Form.Group>
        <Form.Group id={'openOptions-' + this.props.id}>
          <Form.Label>Options</Form.Label>
          <Form.Check
            type='checkbox'
            id={'check-' + this.props.id}
            label='Enable keyed-answer'
            onChange={this.onChangeValue} />
        </Form.Group>
      </Form.Row>
    )
  }
}

OpenAnswerBlock.propType = {
  //key: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.value,
  id: PropTypes.number
}
