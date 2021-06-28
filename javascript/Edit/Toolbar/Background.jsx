import React, {useState} from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/themes/light-border.css'
import {Modal, Row, Col} from 'react-bootstrap'
//import {CirclePicker} from 'react-color'
import ColorSelect from '../AddOn/ColorSelect'
import Dropzone from 'react-dropzone-uploader'
import PropTypes from 'prop-types'

/* global $ */

const {Header, Body} = Modal

export default function Background(props) {
  const [modalView, setModal] = useState(false)

  function insertMedia(fileWithMeta) {
    let formData = new FormData()
    const showId = Number(window.sessionStorage.getItem('id'))
    const slideId = Number(window.sessionStorage.getItem('slideId'))
    let fMeta = fileWithMeta[0]
    formData.append('backgroundMedia', fMeta.file)
    formData.append('slideId', slideId)
    formData.append('id', showId)

    $.ajax({
      url: './slideshow/Slide/background/' + slideId,
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: (imageUrl) => {
        props.changeBackground(imageUrl)
      },
      error: (req, res) => {
        console.error(res)
        alert(
          'An error has occured with this image. Please try a different image.'
        )
      },
    })
  }

  function validate({meta}) {
    if (meta.status === 'rejected_file_type') {
      alert('Sorry, this file type is not supported')
    }
  }

  const modalRender = (
    <Modal show={modalView} onHide={() => setModal(false)} size="lg">
      <Header closeButton>
        <h5>Change Background</h5>
      </Header>
      <Body>
        <ColorSelect changeBackground={props.changeBackground} />
        <Row>
          <Col>
            <h6>Image</h6>
          </Col>
        </Row>
        <div className="card">
          <div className="card-header text-center">Upload</div>
          <Dropzone
            accept="image/jpeg,image/png,image/gif"
            maxFiles={1}
            multiple={false}
            minSizeBytes={1024}
            maxSizeBytes={18388608}
            onChangeStatus={validate}
            onSubmit={insertMedia}
            submitButtonContent={'Insert'}
            inputContent={''}
            classNames={{
              submitButton: 'btn btn-secondary btn-block drop',
              dropzone: 'drop',
            }}
          />
        </div>
      </Body>
    </Modal>
  )

  return (
    <span>
      {modalRender}
      <button className="toolbar" onClick={() => setModal(!modalView)}>
        <i className="fas fa-palette"></i>
      </button>
    </span>
  )
}

Background.propTypes = {
  changeBackground: PropTypes.func,
}
