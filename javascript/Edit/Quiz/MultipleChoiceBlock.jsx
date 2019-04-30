'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row,
  Col
} from 'react-bootstrap'

export default class MultipleChoiceBlock extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      placeholder: props.value,
      //correct: true, // TODO: implement a way for the radio to be already checked on load.
    }

    this.delete = this.delete.bind(this)

  }

  componentDidMount() {
    let place = this.props.placeholder
    if (place == null) {
      place = "Answer text"
    }

    //let checkCorrect = (this.props.correct() == this.props.id)
    this.setState({
      placeholder: place,
      //correct: checkCorrect,
    })
  }


  delete() {
    this.props.remove(this.props.id)
  }

  /* Deprecated
    I am leaving this here for future attemps at tackling the pre-checked radio bug
  onChange(event) {
    //console.log(event.target.id)/*
    //const ids = event.target.id.split('-')
    if (ids[0] == 'check') {
      let check = (ids[1] == this.props.id)
      this.setState({
        correct: check
      })
    }
    this.setState({
      correct: undefined
    })
    this.props.onChange(event)
  }*/

  render() {
    return (
      <Form.Row key={'row-' + this.props.id} id={this.props.id}>
        <Form.Group controlId={'text-' + this.props.id} style={{width: '30rem', marginRight: '1rem'}}>
          <Form.Control
            placeholder={this.state.placeholder}
            onChange={this.props.onChange}
            />
        </Form.Group>
        <Form.Group id={'correct-' + this.props.id}>
          <Form.Check
            type='radio'
            id={'check-' + this.props.id}
            name={'choices'}
            label='Correct Answer'
            onChange={this.props.onChange}
            />
        </Form.Group>
        <Form.Group>
          <a className="close card-text" aria-label="Close" onClick={this.delete}>
            <span style={{marginLeft: 15, color:"grey"}}><i className="fas fa-times"></i></span>
          </a>
        </Form.Group>
      </Form.Row>
    )
  }
}

MultipleChoiceBlock.propTypes = {
  id: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
}
