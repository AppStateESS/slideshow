'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form
} from 'react-bootstrap'

export default class QuestionTitleBlock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: ''
    }
    this.onChange = this.onChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value == undefined && this.props.value != undefined) {
      this.setState({title: this.props.value})
    }
  }

  onChange(event) {
    this.setState({
      title: event.target.value
    })
    this.props.onChange(event)
  }

  render() {
    return (
    <Form.Group key={'questionTitle'} >
      <Form.Label>Question: </Form.Label>
      <Form.Control id={'title-' + this.props.id} value={this.state.title} onChange={this.onChange}/>
    </Form.Group>
    )
  }
}
