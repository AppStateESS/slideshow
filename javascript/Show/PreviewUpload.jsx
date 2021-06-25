'use strict'
import React, {useState} from 'react'
import {Modal} from 'react-bootstrap'
import Tippy from '@tippyjs/react'
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import 'tippy.js/themes/light-border.css'
import PropTypes from 'prop-types'

Media.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changePreview: PropTypes.func,
  useThumb: PropTypes.func,
}

/* global $ */

export default function Media(props) {
  // This is an example of a hook. Check it out on React's documentation site; they're neat
  const [modalView, setModalView] = useState(false)

  function insertMedia(fileWithMeta) {
    // Handle AJAX
    let fMeta = fileWithMeta[0]
    let formData = new FormData()
    formData.append('media', fMeta.file)

    $.ajax({
      url: `./slideshow/Show/preview?id=${props.id}`,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: (imageLocation) => {
        props.changePreview(JSON.parse(imageLocation))
      },
      error: (req, res) => {
        console.log(req)
        console.error(res.toString())
      },
    })
  }

  function removeMedia() {
    $.ajax({
      url: `./slideshow/Show/${props.id}`,
      type: 'DELETE',
      data: {type: 'preview'},
      success: (res) => {
        if (res === 'true') {
          props.changePreview()
        }
      },
      error: (req, res) => {
        console.log(req)
        console.error(res.toString())
      },
    })
  }

  function validate({meta}) {
    if (meta.status === 'rejected_file_type') {
      alert('Sorry, this file type is not supported')
    }
  }

  return (
    <span>
      <Modal
        show={modalView}
        onHide={() => setModalView(false)}
        restoreFocus={false}>
        <Modal.Header closeButton>
          <span>
            <h5>Show Preview Image</h5>
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <div className="card-header text-center">Upload New Preview</div>
            <Dropzone
              accept="image/jpeg,image/png,image/gif"
              maxFiles={1}
              multiple={false}
              minSizeBytes={1024}
              maxSizeBytes={18388608}
              onChangeStatus={validate}
              onSubmit={(fileWithMeta) => {
                insertMedia(fileWithMeta)
                setModalView(false)
              }}
              submitButtonContent={'Insert'}
              inputContent={''}
              classNames={{
                submitButton: 'btn btn-secondary btn-block drop',
                dropzone: 'drop',
              }}
            />
          </div>
          <hr></hr>
          <div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                props.useThumb(true)
                setModalView(false)
              }}>
              Use First Slide as Preview
            </button>
            <button
              className="btn btn-danger btn-block"
              onClick={() => {
                removeMedia()
                setModalView(false)
              }}>
              Remove Current Preview
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Tippy
        theme="light-border"
        content={<div>Change show preview image</div>}
        arrow={true}>
        <button className="tool" onClick={() => setModalView(true)}>
          <i className="fas fa-image"></i>
        </button>
      </Tippy>
    </span>
  )
}
