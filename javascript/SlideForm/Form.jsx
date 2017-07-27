'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import InputField from '../AddOn/Form/InputField.jsx'
import Dropzone from 'react-dropzone'
import ReactSummernote from 'react-summernote'
import {options} from '../Config/Summernote.js'
import 'react-summernote/dist/react-summernote.css'

import 'bootstrap/js/modal'
import 'bootstrap/js/tooltip'
import 'bootstrap/dist/css/bootstrap.css'

/* global $, sectionId */

export default class Form extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.imageUpload = this.imageUpload.bind(this)
    this.saveSlide = this.saveSlide.bind(this)
  }

  uploadBackground(fileList) {}

  saveSlide() {}

  imageUpload(fileList) {
    for (let file of fileList) {
      let formData = new FormData()
      formData.append('sectionId', sectionId)
      formData.append('picture', file)
      $.ajax({
        url: './slideshow/Slide/picture',
        data: formData,
        cache: false,
        dataType: 'json',
        type: 'post',
        processData: false,
        contentType: false,
        success: function (data) {
          ReactSummernote.insertImage(data.path, function (image) {
            image.addClass('img-responsive')
          })
        }.bind(this),
        error: function () {}.bind(this)
      })
    }
  }

  onChange(content) {
    this.setState({content: content})
  }

  delayMinutes() {
    return '0'
  }

  delaySeconds() {
    return '0'
  }

  render() {
    const {slide} = this.props
    let dropzoneImage = (
      <div>
        <i className="fa fa-camera fa-5x"></i><br/>
        <h4>Click to browse<br/>- or -<br/>drag background image here</h4>
      </div>
    )
    return (
      <div>
        <form action="./slideshow/Slide/" method="post">
          <InputField
            name="title"
            required={true}
            label="Title"
            placeholder="Title will not appear during the show"
            value={slide.title}/>
          <label>Slide content</label>
          <ReactSummernote
            value={slide.content}
            options={options}
            onChange={this.props.setValue}
            onImageUpload={this.imageUpload}/>
          <div className="row">
            <div className="col-sm-6">
              <Dropzone
                ref="dropzone"
                multiple={false}
                onDrop={this.uploadBackground}
                className="dropzone text-center pointer">
                {dropzoneImage}
              </Dropzone>
            </div>
            <div className="col-sm-6">
              <label>Delay</label>
              <div>You may want to prevent users from moving forward until they finish
                reading, watching a video, etc.</div>
              <input type="text" value={this.delayMinutes()}/>:<input type="text" value={this.delaySeconds()}/>
            </div>
          </div>
          <hr/>
          <button className="btn btn-primary" onClick={this.saveSlide}>Save slide</button>
        </form>
      </div>
    )
  }
}

Form.propTypes = {
  slide: PropTypes.object,
  sectionId: PropTypes.number,
  setValue: PropTypes.func
}
