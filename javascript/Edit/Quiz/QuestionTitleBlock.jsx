'use strict'
import React, { Component } from 'react'

export default class QuestionTitleBlock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: ''
    }
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    this.setState({ title: this.props.value })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value != this.props.value && this.props.value != undefined) {
      this.setState({ title: this.props.value })
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
      <div key={'questionTitle'} >
        <p style={{textAlign: 'center', marginBottom: 0}}>Question</p>
        <input 
          className="form-control"
          placeholder={this.props.placeholder} 
          id={'title-' + this.props.id} 
          value={this.state.title} 
          onChange={this.onChange} 
          style={formControlStyle}/>
      </div>
    )
  }
}


const formControlStyle = {
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '60%'
}
