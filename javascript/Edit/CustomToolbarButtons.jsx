'use strict'
import React, { Component } from 'react'

import {
  Modal
} from 'react-bootstrap'

import './buttonStyle.css'
import 'react-dropzone-uploader/dist/styles.css'

import { EditorState, AtomicBlckUtils} from 'draft-js'

import Dropzone from 'react-dropzone-uploader'

export default class CustomToolbarButtons extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mediaView: false,
      imageUrl: ''
    }

    this.insertMedia = this.insertMedia.bind(this)
    this.mediaModal = this.mediaModal.bind(this)
    this.mediaCancel = this.mediaCancel.bind(this)
  }

  insertMedia(fileWithMeta) {
    let showId = Number(window.sessionStorage.getItem('id'))
    let slideId = Number(window.sessionStorage.getItem('slideId'));
    // Handle AJAX
    let fMeta = fileWithMeta[0]
    let formData = new FormData()
    formData.append('media', fMeta.file)
    formData.append('slideId', slideId)
    formData.append('id', showId)
    
    $.ajax({
      url: './slideshow/Slide/image/' + window.sessionStorage.getItem('id'),
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: (imageUrl) => {
        window.sessionStorage.setItem('imgUrl', JSON.parse(imageUrl))
        // This caused editView to rerender
        this.props.setEditorState(EditorState.moveFocusToEnd(this.props.getEditorState()))
      },
      error: (req, res) => {
        console.log(req)
        console.error(res)
      }
    })
    this.setState({mediaView: false})
  }

  mediaModal() {
    this.setState({mediaView: true})
  }

  mediaCancel() {
    this.setState({mediaView: false})
  }

  render() {

    let mediaModal = (
      <Modal show={this.state.mediaView} onHide={this.mediaCancel}>
        <Modal.Header closeButton>
          <h5>Insert Image</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <div className="card-header text-center" >
              Upload
            </div>
            <Dropzone
              accept="image/jpeg,image/png"
              maxFiles={1}
              multiple={false}
              minSizeBytes={1024}
              maxSizeBytes={18388608}
              onSubmit={this.insertMedia}
              submitButtonContent={'Insert'}
              inputContent={''}
              classNames={{submitButton: 'btn btn-secondary btn-block drop', dropzone: 'drop'}}
            />
          </div>
        </Modal.Body>
      </Modal>
    )

    return (
      <span>
        {mediaModal}
        <button className="toolbar" onClick={this.mediaModal}><i className="fas fa-images"></i></button>
      </span>
    )
  }
}
