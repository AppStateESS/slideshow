import React, { useState } from 'react'
import Tippy from '@tippy.js/react'
import { Modal, Row, Col } from 'react-bootstrap'
import { CirclePicker } from 'react-color'
import Dropzone from 'react-dropzone-uploader'

const { Header, Body } = Modal

export default function Background() {

    const [modalView, setModal] = useState(false)

    function changeColor(e) {
        console.log(e.hex)
    }


    function insertMedia() {

    }

    function validate({meta}) {
        if (meta.status === 'rejected_file_type') {
            alert("Sorry, this file type is not supported")
        }
    }

    const modalRender = (
        <Modal show={modalView} onHide={() => setModal(false)}>
            <Header>
                <h5>Change Background</h5>
            </Header>
            <Body>
                <Row flex="space-apart">
                <Col>
                    <h6>Color</h6>
                </Col>
                <Col>
                    <CirclePicker
                        colors = {["#CD6155", "#EC7063", "#AF7AC5", "#A569BD", "#5499C7", "#5DADE2", "#48C9B0", "#45B39D",
                        "#52BE80", "#58D68D", "#F4D03F", "#F5B041", "#FAD7A0", "#EB984E", "#DC7633", "#AAB7B8", "#CACFD2", "#E5E7E9"]}
                        onChangeComplete={changeColor}
                    />
                </Col>
                </Row>
                <Row><Col><h6>Image</h6></Col></Row>
                <div className="card">
                    <div className="card-header text-center" >
                        Upload
                    </div>
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
                        classNames={{submitButton: 'btn btn-secondary btn-block drop', dropzone: 'drop'}}
                    />
                </div>
            </Body>
        </Modal>
    )

    return (
        <span>
            {modalRender}
            <Tippy content={<div>Change Background</div>} arrow>
                <button className="toolbar" onClick={() => setModal(!modalView)}><i className="fas fa-image"></i></button>
            </Tippy>
        </span>
    )
}
