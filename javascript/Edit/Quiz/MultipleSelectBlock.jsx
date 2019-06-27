import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
} from 'react-bootstrap'

export default class MultipleSelectBlock extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.id,
      value: props.value
    }
    this.delete = this.delete.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
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
        <Form.Group controlId={'text-' + this.props.id} style={{ width: '30rem', marginRight: '1rem' }}>
          <Form.Control
            value={this.state.value}
            onChange={this.onChangeValue}
          />
        </Form.Group>
        <Form.Group id={'correct-' + this.props.id}>
          <Form.Check
            custom
            type='checkbox'
            id={'select-' + this.props.id}
            name={'choices'}
            label='Correct Answer'
            onChange={this.props.onChange}
            checked={this.props.checked}
          />
        </Form.Group>
        <Form.Group>
          <a className="close card-text" aria-label="Close" onClick={this.delete}>
            <span style={{ marginLeft: 15, color: "grey" }}><i className="fas fa-times"></i></span>
          </a>
        </Form.Group>
      </Form.Row>
    )
  }
}

MultipleSelectBlock.propTypes = {
  id: PropTypes.number,
  onChange: PropTypes.func,
}
