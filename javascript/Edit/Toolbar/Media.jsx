'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal} from 'react-bootstrap'
import Tippy from '@tippyjs/react'
import Dropzone from 'react-dropzone-uploader'
import './toolbar.css'
import 'react-dropzone-uploader/dist/styles.css'
import 'tippy.js/themes/light-border.css'

/* global $ */

export default class Media extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mediaView: false,
      imageUrl: '',
    }

    this.insertMedia = this.insertMedia.bind(this)
    this.validate = this.validate.bind(this)
    this.mediaModal = this.mediaModal.bind(this)
    this.mediaCancel = this.mediaCancel.bind(this)
  }

  insertMedia(fileWithMeta) {
    let showId = Number(window.sessionStorage.getItem('id'))
    let slideId = Number(window.sessionStorage.getItem('slideId'))
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
        this.props.saveMedia(JSON.parse(imageUrl), 'right')
      },
      error: (req, res) => {
        console.log(req)
        console.error(res)
        alert(
          'An error has occured with this image. Please try a different image.'
        )
      },
    })
    this.setState({mediaView: false})
  }

  validate({meta}) {
    if (meta.status === 'rejected_file_type') {
      alert('Sorry, this file type is not supported')
    }
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
            <div className="card-header text-center">Upload</div>
            <Dropzone
              accept="image/jpeg,image/png,image/gif"
              maxFiles={1}
              multiple={false}
              minSizeBytes={1024}
              maxSizeBytes={18388608}
              onChangeStatus={this.validate}
              onSubmit={this.insertMedia}
              submitButtonContent={'Insert'}
              inputContent={''}
              classNames={{
                submitButton: 'btn btn-secondary btn-block drop',
                dropzone: 'drop',
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    )

    return (
      <span>
        {mediaModal}
        <button className="toolbar" onClick={this.mediaModal}>
          <i className="fas fa-image"></i>
        </button>
      </span>
    )
  }
}

Media.propTypes = {
  saveMedia: PropTypes.func,
}
