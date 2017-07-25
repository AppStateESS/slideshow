'use strict'
import React, { Component } from 'react'
//import PropTypes from 'prop-types'
import InputField from '../AddOn/Form/InputField.jsx'
import Slide from '../Resources/Slide.js'
import ReactSummernote from 'react-summernote'
import 'react-summernote/dist/react-summernote.css'

import 'bootstrap/js/modal'
import 'bootstrap/js/dropdown'
import 'bootstrap/js/tooltip'
import 'bootstrap/dist/css/bootstrap.css'

/* global $, sectionId */

export default class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slide: Slide,
      dataUri: null,
      filename: '',
      filetype: '',
    }
    this.onChange = this.onChange.bind(this)
    this.imageUpload = this.imageUpload.bind(this)
  }

  imageUpload(fileList) {
    for(let file of fileList) {
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
          ReactSummernote.insertImage(data.path, function(image){
            image.addClass('img-responsive')
          })
        }.bind(this),
        error: function (data) {}
          .bind(this)
      })
    }
  }

  onChange(content) {
    this.setState({ content: content })
  }

  render() {
    const toolbar = [
      ['style', ['style']],
      ['font', ['bold', 'italic', 'clear']],
      ['fontname', ['fontname']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture', 'video']],
      ['view', ['fullscreen', 'codeview']]
    ]
    const options = {
      height: 350,
      dialogsInBody: true,
      toolbar: toolbar
    }
    const { slide } = this.state
    return(
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
            onChange={this.onChange}
            onImageUpload={this.imageUpload}/>
        </form>
      </div>
    )
  }
}

Form.propTypes = {}
