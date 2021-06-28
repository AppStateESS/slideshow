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

    this.mediaModal = this.mediaModal.bind(this)
    this.mediaCancel = this.mediaCancel.bind(this)
  }


  mediaModal() {
    this.setState({mediaView: true})
  }

  mediaCancel() {
    this.setState({mediaView: false})
  }

  render() {
    let mediaModal = (
      <Modal show={this.props.mediaView} onHide={this.props.mediaCancel}>
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
              onChangeStatus={this.props.validate}
              onSubmit={this.props.insertMedia}
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
        <Tippy
          theme="light-border"
          content={<div>Insert Image</div>}
          arrow={true}>
          <button className="toolbar" onClick={this.props.mediaOpen}>
            <i className="fas fa-images"></i>
          </button>
        </Tippy>
      </span>
    )
  }
}

Media.propTypes = {
  validate: PropTypes.func,
  insertMedia: PropTypes.func
}
