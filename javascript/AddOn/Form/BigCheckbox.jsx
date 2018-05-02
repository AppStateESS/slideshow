'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import empty from '../Empty.js'

export default class BigCheckbox extends Component {
  constructor(props) {
    super(props)
    this.handle = this.handle.bind(this)
  }

  handle()
  {
    this.props.handle(empty(this.props.checked))
  }

  render() {
    const mute = {
      color: '#666'
    }
    const point = {
      cursor: 'pointer',
      display: 'inline-block'
    }
    const labelText = {
      fontSize : '20px',
      display: 'inline-block',
      marginTop: '4px'
    }

    return (
      <div onClick={this.handle} style={point} className="big-checkbox">
        <div className="fa-stack fa-lg float-left">
          <i className="far fa-square fa-stack-2x" style={mute}></i>
          {empty(this.props.checked) ? null :
          <i className="fa fa-check text-success fa-stack-2x"></i>}
        </div>&nbsp;
        <div style={labelText} className={!empty(this.props.checked) ? 'text-success' : 'text-muted'}>{this.props.label}</div>
      </div>
    )
  }
}

BigCheckbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.oneOfType([PropTypes.bool,PropTypes.string,PropTypes.number]),
  handle: PropTypes.func.isRequired
}

BigCheckbox.defaultProps = {
  checked: false
}
