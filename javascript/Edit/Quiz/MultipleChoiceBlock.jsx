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
      id: props.id,
      value: props.value, // This will need to be initialized in a componentMount method in the future
      //correct: true, // TODO: implement a way for the radio to be already checked on load.
    }

    this.delete = this.delete.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
  }

  componentDidMount() {
    /* Not used - for placeholder if we want one
    let place = this.props.value
    if (place == null) {
      place = "Answer text"
    }

    //let checkCorrect = (this.props.correct() == this.props.id)
    this.setState({
      value: place,
      //correct: checkCorrect,
    })*/
  }


  delete() {
    this.props.remove(this.props.id)
  }


  onChangeValue(event) {
    this.setState({
      value: event.target.value
    })
    this.props.onChange(event)
  }

  render() {
    return (
      <Form.Row key={'row-' + this.props.id} id={this.props.id}>
        <Form.Group controlId={'text-' + this.props.id} style={{width: '30rem', marginRight: '1rem'}}>
          <Form.Control
            value={this.state.value}
            onChange={this.onChangeValue}
            />
        </Form.Group>
        <Form.Group id={'correct-' + this.props.id}>
          <Form.Check
            custom
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
