import React, { useState } from 'react'
import Tippy from '@tippy.js/react'
import { Modal, Row, Col } from 'react-bootstrap'
import { CirclePicker } from 'react-color'
import ColorSelect from '../AddOn/ColorSelect'
import Dropzone from 'react-dropzone-uploader'

const { Header, Body } = Modal

export default function Background(props) {

    const [modalView, setModal] = useState(false)

    function insertMedia(fileWithMeta) {
        console.log(fileWithMeta)
        let formData = new FormData()
        const showId = Number(window.sessionStorage.getItem('id'))
        const slideId = Number(window.sessionStorage.getItem('slideId'));
        let fMeta = fileWithMeta[0]
        console.log(fMeta.file)
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
                console.log(imageUrl)
            },
            error: (req, res) => {
                console.log(res)
            }
        })
    }

    function validate({meta}) {
        if (meta.status === 'rejected_file_type') {
            alert("Sorry, this file type is not supported")
        }
    }

    const modalRender = (
        <Modal show={modalView} onHide={() => setModal(false)} size="lg">
            <Header closeButton>
                <h5>Change Background</h5>
            </Header>
            <Body>
                {/*<Row flex="space-apart">
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
    </Row>*/}
        <ColorSelect changeBackground={props.changeBackground} />
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
