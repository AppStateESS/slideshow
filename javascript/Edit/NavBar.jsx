'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Dropdown,
  DropdownButton
} from 'react-bootstrap'

import Settings from './Settings.jsx'

export default class NavBar extends Component {
  constructor() {
    super()

    this.returnToShowList = this.returnToShowList.bind(this)
    this.handlePresent = this.handlePresent.bind(this)
  }

  returnToShowList() {
    this.props.saveDB()
    // This inteval fixes a bug on firefox where the browser loads faster than it can save
    window.setInterval(()=> {window.location.href = './slideshow/Show/list'}, 100)

  }

  handlePresent() {
    if (this.props.id == -1) {
      alert("A problem has occurred with your browser's session. This is most likely caused by an attempt to present an empty show.")
      //window.location.href = './slideshow/Show/list'
    }
    else {
      this.props.saveDB()
      window.sessionStorage.setItem('id', this.props.id)
      window.setInterval(() => window.location.href = './slideshow/Slide/Present/?id=' + this.props.id, 100)
    }
  }

  render() {

    return (
    <div>
      <ButtonToolbar>
        <ButtonGroup aria-label="Return Group">
          <Button onClick={this.returnToShowList} color="primary"><i className="fas fa-arrow-circle-left"></i> Show List</Button>
        </ButtonGroup>
        <ButtonGroup style={{marginLeft: 10}} aria-label="Slide-present Group">
          <Button variant="secondary" onClick={this.props.saveDB}><i className="fas fa-save"></i></Button>
            <DropdownButton as={ButtonGroup} title="Slide" variant="secondary">
              <Dropdown.Item onClick={this.props.insertSlide}>Insert Slide</Dropdown.Item>
              <Dropdown.Item onClick={this.props.insertQuiz}>Insert Quiz</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item style={{color: "red"}} onClick={this.props.deleteSlide}>Delete Slide</Dropdown.Item>
           </DropdownButton>
           <Button variant="secondary" onClick={this.handlePresent}>Preview</Button>
        </ButtonGroup>
          <Settings
            changeBackground ={this.props.changeBackground}
            id               ={this.props.id}
            currentColor     ={this.props.currentColor}
            slideTimer       ={this.props.slideTimer}/>
      </ButtonToolbar>
    </div>
    )
  }

}

NavBar.propTypes = {
  insertSlide: PropTypes.func,
  deleteSlide: PropTypes.func,
  currentSlide: PropTypes.number,
  saveDB: PropTypes.func,
  id: PropTypes.number,
  changeBackground: PropTypes.func,
  currentColor: PropTypes.string,
}
