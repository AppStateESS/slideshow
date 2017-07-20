'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

/**
 * When using errorMessage with required, be sure to clear
 * the errorMessage prop on successful input
 */

export default class InputField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      empty: false
    }

    this.handleBlur = this.handleBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleBlur(e) {
    const value = e.target.value
    if (value.length === 0) {
      this.setState({empty: true})
      if (this.props.onEmpty) {
        this.props.onEmpty()
      }
    } else {
      this.setState({empty: false})
    }
    if (this.props.blur) {
      this.props.blur()
    }
  }

  emptyMessage() {
    if (this.props.label.length > 0) {
      return this.props.label + ' may not be empty'
    } else {
      return 'Field may not be empty'
    }
  }

  select(event) {
    event.target.select()
  }

  handleChange(e) {
    const value = e.target.value
    if (value.length > 0) {
      this.setState({empty: false})
    }
    this.props.change(e)
  }

  render() {
    let inputClass
    if ((this.props.errorMessage !== null && this.props.errorMessage !== '') || (this.state.empty && this.props.required && this.props.disableRequireCheck === false)) {
      inputClass = 'form-control error-highlight'
    } else {
      inputClass = 'form-control'
    }
    let required = this.props.required
      ? <RequiredIcon/>
      : null

    let input = (<input
      id={this.props.iid}
      type={this.props.type}
      name={this.props.name}
      value={this.props.value === null ? '' : this.props.value}
      className={inputClass}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
      onClick={this.props.selectOnClick === true
      ? this.select
      : null}
      disabled={this.props.disabled}
      size={this.props.size}
      maxLength={this.props.maxLength}
      placeholder={this.props.placeholder}
      autoComplete={this.props.autocomplete}/>)

    if (this.props.wrap) {
      input = this.props.wrap(input)
    }

    let errorMessage
    if (this.props.errorMessage) {
      errorMessage = this.props.errorMessage
    } else if (this.state.empty && this.props.required && this.props.disableRequireCheck === false) {
      errorMessage = this.emptyMessage()
    }

    return (
      <div className="form-group">
        {this.props.label.length > 0
          ? <label htmlFor={this.props.iid}>{this.props.label} {required}</label>
          : undefined}
        {input}
        {errorMessage
          ? <div className="label label-danger">{errorMessage}</div>
          : null}
      </div>
    )
  }
}

InputField.defaultProps = {
  label: '',
  type: 'text',
  name: '',
  value: '',
  change: null,
  blur: null,
  required: false,
  id: null,
  autocomplete: false,
  placeholder: null,
  errorMessage: '',
  disabled: false,
  size: null,
  maxLength: null,
  selectOnClick: true,
  wrap: null,
  onEmpty: null,
  flagEmpty: true,
  disableRequireCheck: false
}

InputField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  change: PropTypes.func,
  blur: PropTypes.func,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  iid: PropTypes.string,
  autocomplete: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.number,
  maxLength: PropTypes.number,
  wrap: PropTypes.func,
  selectOnClick: PropTypes.bool,
  onEmpty: PropTypes.func,
  flagEmpty: PropTypes.bool,
  disableRequireCheck: PropTypes.bool
}

export const RequiredIcon = () => {
  return <i className="fa fa-asterisk text-danger"></i>
}
