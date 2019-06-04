'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonGroup,
  Modal,
  Form,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap'
import { CirclePicker } from 'react-color';

export default class Settings extends Component {
  constructor() {
    super()
    this.state = {
      settings: false,
      background: 'blue',
    }

    this.toggleSettings = this.toggleSettings.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  toggleSettings() {
    this.setState({settings: !this.state.settings})
  }

  handleChange (color) {
    this.setState({background: color.hex})
  }


  render() {

    return (

      <ButtonGroup style={{marginLeft: 10}} aria-label="settings">
        <Button onClick={this.toggleSettings} variant="secondary">Settings</Button>
          <Modal
            size="lg"
            show={this.state.settings}
            onHide={this.toggleSettings}
            aria-labelledby="settings-modal"
            centered
            >
           <Modal.Header closeButton>
             <Modal.Title id="settings-modal">
              Settings
             </Modal.Title>
           </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <OverlayTrigger
                placement = 'right'
                overlay={
                  <Tooltip>Changes timing for all slides</Tooltip>
                }
                >
                  <Form.Label>Slide Time<i className="far fa-question-circle"></i></Form.Label>
                </OverlayTrigger>
              </Col>
              <Col>
                <Form.Control as="select">
                  <option>1s</option>
                  <option>2s</option>
                  <option>3s</option>
                  <option>4s</option>
                  <option>5s</option>
               </Form.Control>
             </Col>
          </Row>
            <p></p>
          <Row>
            <Col>
              Background Color
            </Col>
            <Col>
              <CirclePicker
                onChangeComplete={this.handleChange}
              />
           </Col>
          </Row>
        </Modal.Body>
      </Modal>
      </ButtonGroup>
    )
  }
}
