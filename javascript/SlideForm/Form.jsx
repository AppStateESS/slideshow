'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import InputField from '../AddOn/Form/InputField.jsx'
import Dropzone from 'react-dropzone'
import ReactSummernote from 'react-summernote'
import {options} from '../Config/Summernote.js'
import 'react-summernote/dist/react-summernote.css'
import './slide.css'

import 'bootstrap/js/modal'
import 'bootstrap/js/tooltip'
import 'bootstrap/dist/css/bootstrap.css'

/* global $, sectionId */

export default class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delayMinutes: 0,
      delaySeconds: 0
    }
    this.imageUpload = this.imageUpload.bind(this)
    this.updateMinutes = this.updateMinutes.bind(this)
    this.updateSeconds = this.updateSeconds.bind(this)
    this.checkSeconds = this.checkSeconds.bind(this)
    this.checkMinutes = this.checkMinutes.bind(this)
    this.uploadBackground = this.uploadBackground.bind(this)
    this.clearImage = this.clearImage.bind(this)
  }

  updateMinutes(e) {
    const value = e.target.value
    this.setState({delayMinutes: value})
  }

  updateSeconds(e) {
    const value = e.target.value
    this.setState({delaySeconds: value})
  }

  checkMinutes() {
    let finalMinutes = parseInt(this.state.delayMinutes)
    if (finalMinutes > 10) {
      finalMinutes = 10
    }
    this.setState({delayMinutes: finalMinutes})
  }

  clearImage(e) {
    e.preventDefault()
    const {slide} = this.props
    $.ajax({
      url: 'slideshow/Slide/' + slide.id + '/clearPicture',
      dataType: 'json',
      type: 'patch',
      success: function () {
        this.props.setValue('backgroundImage', '')
      }.bind(this),
      error: function () {}.bind(this),
    })
  }

  checkSeconds() {
    if (this.state.delaySeconds > 59) {
      let finalMinutes = Math.floor(this.state.delaySeconds / 60)
      let finalSeconds = parseInt(this.state.delaySeconds % 60)
      finalMinutes = parseInt(this.state.delayMinutes) + parseInt(finalMinutes)
      if (finalMinutes > 10) {
        finalMinutes = 10
        finalSeconds = 0
      }
      this.setState({delayMinutes: finalMinutes, delaySeconds: finalSeconds})
    } else {
      this.setState({
        delaySeconds: parseInt(this.state.delaySeconds)
      })
    }
  }

  sendImage(file) {
    let formData = new FormData()
    formData.append('slideId', this.props.slide.id)
    formData.append('picture', file)

    return $.ajax({
      url: './slideshow/Slide/picture',
      data: formData,
      cache: false,
      dataType: 'json',
      type: 'post',
      processData: false,
      contentType: false
    })
  }

  uploadBackground(fileList) {
    const response = this.sendImage(fileList[0])
    response.success(function (data) {
      this.props.setValue('backgroundImage', data.path)
      this.props.patchValue('backgroundImage', data.path)
    }.bind(this))
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

  render() {
    const {slide} = this.props
    const imageStyle = {
      maxHeight: '188px'
    }
    let clearButton = null
    let dropzoneImage = (
      <div>
        <i className="fa fa-camera fa-5x"></i><br/>
        <h4>Click to browse<br/>- or -<br/>drag image here</h4>
      </div>
    )
    if (slide.backgroundImage !== null && slide.backgroundImage.length > 0) {
      clearButton = <button className="btn btn-warning btn-sm" onClick={this.clearImage}>Clear</button>
      dropzoneImage = <img style={imageStyle} className="img-responsive" src={slide.backgroundImage}/>
    }
    return (
      <div className="container-fluid">
        <form action="./slideshow/Slide/" method="post">
          <InputField
            name="title"
            required={true}
            change={this.props.setValue.bind(null, 'title')}
            focus={true}
            blur={this.props.patchValue.bind(null, 'title')}
            placeholder="Title will not appear during the show"
            value={slide.title}/>
          <label>Slide content</label>
          <ReactSummernote
            value={slide.content}
            options={options}
            onChange={this.props.setValue.bind(null, 'content')}
            onBlur={this.props.patchValue.bind(null, 'content')}
            onImageUpload={this.imageUpload}/>
          <div className="row">
            <div className="col-sm-6">
              <h3>Background image</h3>
              <Dropzone
                ref="dropzone"
                multiple={false}
                onDrop={this.uploadBackground}
                className="dropzone text-center pointer">
                {dropzoneImage}
              </Dropzone>
              {clearButton}
            </div>
            <div className="col-sm-6">
              <label>
                <h3>Delay</h3>
              </label>
              <div>You may want to prevent users from moving forward until they finish
                reading, watching a video, etc.</div>
              <div id="delay" className="marginTop">
                <input
                  type="number"
                  className="form-control"
                  value={this.state.delayMinutes}
                  size="2"
                  min="0"
                  max="10"
                  maxLength="2"
                  onBlur={this.checkMinutes}
                  onChange={this.updateMinutes}/>
                min.&nbsp;<input
                  type="number"
                  size="2"
                  min="0"
                  max="59"
                  maxLength="2"
                  className="form-control"
                  onChange={this.updateSeconds}
                  onBlur={this.checkSeconds}
                  value={this.state.delaySeconds}/>
                secs.
              </div>
              <small>Ten minute maximum</small>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

Form.propTypes = {
  slide: PropTypes.object,
  sectionId: PropTypes.number,
  setValue: PropTypes.func,
  patchValue: PropTypes.func.isRequired,
}
