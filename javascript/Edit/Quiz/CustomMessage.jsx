import React from 'react'
import {
    Form,
    Modal,
    Button
  } from 'react-bootstrap'

export default function CustomMessage(props) {

    return (
        <Modal
          show={props.show}
          onHide={props.onHide}
          aria-labelledby="example-modal-sizes-title-sm"
          keyboard>
          <div style={{ boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
            <Modal.Header closeButton>
              <Modal.Title>Answer Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formBasicEmail">
                
                <Form.Label style={{wordWrap: 'breakWord'}}>Custom Correct message</Form.Label>
                <Form.Control />
              </Form.Group>
              <Form.Group controlId="formGroupPassword">
              <Form.Label>Custom Incorrect message</Form.Label>
              <Form.Control />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button>Save</Button>
            </Modal.Footer>
          </div>
        </Modal>
    )
}