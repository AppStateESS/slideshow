'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import InputField from '../AddOn/Form/InputField.jsx'
import {options} from '../Config/Summernote.js'
import ReactSummernote from 'react-summernote'
import BigCheckbox from '../AddOn/Form/BigCheckbox.jsx'

export default class DecisionForm extends Component {
  constructor(props) {
    super(props)
    this.updateNext = this.updateNext.bind(this)
    this.updateLockout = this.updateLockout.bind(this)
  }

  imageUpload(fileList) {
    for (let file of fileList) {
      const response = this.sendImage(file)
      response.success(function (data) {
        ReactSummernote.insertImage(data.path, function (image) {
          image.addClass('img-responsive')
        })
      }.bind(this))
    }
  }

  updateNext(value) {
    this.props.setValue('next', value)
    this.props.patchValue('next')
  }

  updateLockout(value) {
    this.props.setValue('lockout', value)
    this.props.patchValue('lockout')
  }

  render() {
    const {decision} = this.props
    return (
      <div>
        <form method="post" action="./slideform/Decision">
          <InputField
            name="title"
            required={true}
            label="Choice title"
            change={this.props.setValue.bind(null, 'title')}
            focus={true}
            blur={this.props.patchValue.bind(null, 'title', false)}
            placeholder="True, False, etc."
            value={decision.title}/>
          <div><BigCheckbox
            label="Allow continue after selection"
            checked={decision.next}
            handle={this.updateNext}/></div>
          <div><BigCheckbox
            label="Lock after selection"
            checked={decision.lockout}
            handle={this.updateLockout}/></div>
          <h4>Message</h4>
          <ReactSummernote
            value={decision.message}
            options={options}
            onChange={this.props.setValue.bind(null, 'message')}
            onBlur={this.props.patchValue.bind(null, 'message')}
            onImageUpload={this.imageUpload}/>
        </form>
      </div>
    )
  }
}

DecisionForm.propTypes = {
  decision: PropTypes.object.isRequired,
  setValue: PropTypes.func,
  patchValue: PropTypes.func
}
