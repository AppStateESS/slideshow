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
  Card,
  InputGroup,
  FormControl
} from 'react-bootstrap'

import Tippy from '@tippyjs/react'

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
        <Form.Group controlId={'openOptions-' + this.props.id}>
          <Form.Label>Options</Form.Label>
          <InputGroup className="mb-3">
            <Tippy
              content="Enable min word count"
              arrow={true}>
              <InputGroup.Prepend>
                <InputGroup.Checkbox aria-label="Checkbox for following text input" />
              </InputGroup.Prepend>
            </Tippy>
            <FormControl 
              disabled={false}
              aria-label="Text input with checkbox" 
              placeholder="Min word count" 
              onChange={this.onChangeValue}
              value={this.state.value} />
          </InputGroup>
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
