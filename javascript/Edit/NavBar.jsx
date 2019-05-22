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

export default class NavBar extends Component {
  constructor() {
    super()

    this.returnToShowList = this.returnToShowList.bind(this)
    this.handlePresent = this.handlePresent.bind(this)
  }

  returnToShowList() {
    this.props.save()
    window.location.href = './slideshow/Show/list'
  }

  handlePresent() {
    this.props.save()
    window.sessionStorage.setItem('id', this.props.id)
    window.location.href = './slideshow/Show/Present/?id=' + this.props.id
  }

  render() {

    return (
    <div>
      <ButtonToolbar>
        <ButtonGroup aria-label="Return Group">
          <Button onClick={this.returnToShowList} color="primary"><i className="fas fa-arrow-circle-left"></i> Show List</Button>
        </ButtonGroup>
        <ButtonGroup style={{marginLeft: 10}} aria-label="Slide-present Group">
          <Button variant="secondary" onClick={this.props.save}><i className="fas fa-save"></i></Button>
            <DropdownButton as={ButtonGroup} title="Slide" variant="secondary">
              <Dropdown.Item onClick={this.props.insertSlide}>Insert Slide</Dropdown.Item>
              <Dropdown.Item onClick={this.props.insertQuiz}>Insert Quiz</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item style={{color: "red"}} onClick={this.props.deleteSlide}>Delete Slide</Dropdown.Item>
           </DropdownButton>
           <Button variant="secondary" onClick={this.handlePresent}>Present</Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    )
  }

}

NavBar.propTypes = {
  save: PropTypes.func,
  insertSlide: PropTypes.func,
  deleteSlide: PropTypes.func,
  currentSlide: PropTypes.number,
  saveDB: PropTypes.func,
}
