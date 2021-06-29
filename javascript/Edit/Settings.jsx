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
  OverlayTrigger,
  Popover,
} from 'react-bootstrap'
import {CirclePicker, SketchPicker} from 'react-color'
import AnimateDropdown from './AddOn/AnimateDropdown'
import './custom.css'
/* global $ */

export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: false,
      slideTimer: '2s',
      displaySketchPicker: false,
    }

    this.toggleSettings = this.toggleSettings.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.changeTime = this.changeTime.bind(this)
    this.handleSketchPicker = this.handleSketchPicker.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.slideTimer != this.props.slideTimer) {
      this.setState({
        slideTimer: String(this.props.slideTimer) + 's',
      })
    }
  }

  toggleSettings() {
    this.setState({settings: !this.state.settings})
  }

  handleColorChange(color) {
    this.props.saveBackground(color.hex)
  }

  changeTime(event) {
    // converts to number
    this.setState({slideTimer: event.target.value})
    const time = parseInt(event.target.value, 10)
    $.ajax({
      url: './slideshow/Show/' + this.props.id,
      data: {slideTimer: time},
      type: 'put',
      error: (req, res) => {
        console.error(req, res.toString())
      },
    })
  }

  handleSketchPicker() {
    this.setState({displaySketchPicker: !this.state.displaySketchPicker})
  }

  render() {
    let colorPick
    if (this.state.displaySketchPicker == true) {
      colorPick = (
        <div className="SketchPicker">
          <SketchPicker
            color={this.props.currentColor}
            onChangeComplete={this.handleColorChange}
          />
        </div>
      )
    }
    let colorPickStyle = this.state.hover
      ? {borderColor: this.props.currentColor}
      : {color: this.props.currentColor}
    return (
      <ButtonGroup style={{marginLeft: 10}} aria-label="settings">
        <Button onClick={this.toggleSettings} variant="secondary">
          Settings
        </Button>
        <Modal
          size="lg"
          show={this.state.settings}
          onHide={this.toggleSettings}
          aria-labelledby="settings-modal"
          keyboard>
          <div
            style={{
              boxShadow:
                '0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            }}>
            <Modal.Header closeButton>
              <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <Form.Label className="settings-options">
                    Slide Timer
                  </Form.Label>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Popover title="Slide Time Restriction">
                        Select required wait time for each slide before
                        continuing to the next slide. (Does not apply to
                        quizzes)
                      </Popover>
                    }>
                    <a style={{marginLeft: 10}}>
                      <i className="far fa-question-circle"></i>
                    </a>
                  </OverlayTrigger>
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={this.state.slideTimer}
                    onChange={this.changeTime}>
                    <option>0s</option>
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
                <Col sm={6} className="settings-options">
                  Background Color
                </Col>
                <Col sm={4}>
                  <CirclePicker
                    colors={[
                      '#CD6155',
                      '#EC7063',
                      '#AF7AC5',
                      '#A569BD',
                      '#5499C7',
                      '#5DADE2',
                      '#48C9B0',
                      '#45B39D',
                      '#52BE80',
                      '#58D68D',
                      '#F4D03F',
                      '#F5B041',
                      '#FAD7A0',
                      '#EB984E',
                      '#DC7633',
                      '#AAB7B8',
                      '#CACFD2',
                      '#E5E7E9',
                    ]}
                    onChangeComplete={this.handleColorChange}
                  />
                </Col>
                <Col sm={2}>
                  <a
                    onMouseOver={() => this.setState({hover: true})}
                    onMouseLeave={() => this.setState({hover: false})}>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Popover title="Custom Slide Background Color">
                          Click to enter custom color
                        </Popover>
                      }>
                      <button
                        className="ColorPicker"
                        style={colorPickStyle}
                        onClick={this.handleSketchPicker}>
                        <i
                          className="fas fa-palette"
                          style={{color: '#292b2c'}}></i>
                      </button>
                    </OverlayTrigger>
                  </a>
                  {colorPick}
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col sm={6} className="settings-option">
                  Slide Animation
                </Col>
                <Col>
                  <AnimateDropdown
                    id={this.props.id}
                    animation={this.props.animation}
                    setAnimation={this.props.setAnimation}
                  />
                </Col>
                <Col
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '12%',
                  }}>
                  <a href={`./slideshow/Slide/Present/?id=${this.props.id}`}>
                    Preview <i className="fas fa-arrow-circle-right"></i>
                  </a>
                </Col>
              </Row>
            </Modal.Body>
          </div>
        </Modal>
      </ButtonGroup>
    )
  }
}

Settings.propTypes = {
  slideTimer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  saveBackground: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentColor: PropTypes.string,
  animation: PropTypes.string,
  setAnimation: PropTypes.func,
}
