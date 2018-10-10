'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonGroup,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  Input,
  InputGroupAddon

} from 'reactstrap'

export default class NavBar extends Component {
  constructor() {
    super()
    this.state = {
      fileOpen: false,
      editOpen: false,
      insertOpen: false,
      renameOpen: false,
      renameVal: ""
    }

    this.toggleFile = this.toggleFile.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.toggleInsert = this.toggleInsert.bind(this)
    this.toggleRename = this.toggleRename.bind(this)
    this.handleRename = this.handleRename.bind(this)
    this.renameCurrentSlide = this.renameCurrentSlide.bind(this)
    this.handleDeleteSlide = this.handleDeleteSlide.bind(this)
  }

  toggleFile() {
    this.setState({
      fileOpen: !this.state.fileOpen
    })
  }

  toggleEdit() {
    this.setState({
      editOpen: !this.state.editOpen
    })
  }

  toggleInsert() {
    this.setState({
      insertOpen: !this.state.insertOpen
    })
  }

  toggleRename() {
    this.setState({
      renameOpen: !this.state.renameOpen
    })
  }

  handleRename(event) {
    this.setState({
      renameVal: event.target.value
    })
  }

  renameCurrentSlide(newName) {
    if (this.state.renameVal !== null) {
      this.props.renameSlide(newName)
      this.toggleRename()
    }
    else {
      console.log("Error: null value")
    }
  }

  handleDeleteSlide(){
    this.props.deleteSlide(this.props.currentSlide)
  }

  render() {
    const modal = (
      <Modal isOpen={this.state.renameOpen} toggle={this.toggleRename} fade={false} backdrop={true}>
        <ModalHeader toggle={this.toggleRename}>Rename Slide Title:</ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input
                    type="text"
                    placeholder="Rename Slide"
                    onChange={this.handleRename}
                    value={this.state.renameVal} />
              <InputGroupAddon addonType="append">
            <Button onClick={this.renameCurrentSlide.bind(this, this.state.renameVal)} color="success">Save</Button>
            </InputGroupAddon>
          </InputGroup>
        </ModalBody>
      </Modal>
    )

    return (
      <div>
      <ButtonGroup>
        <ButtonDropdown isOpen={this.state.fileOpen} toggle={this.toggleFile}>
          <DropdownToggle caret>
            File
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.props.save}>Save</DropdownItem>
            <DropdownItem>Present Show</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown isOpen={this.state.editOpen} toggle={this.toggleEdit}>
          <DropdownToggle caret>
            Edit
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.props.insertSlide}>Insert Slide</DropdownItem>
            <DropdownItem onClick={this.handleDeleteSlide}>Delete Slide</DropdownItem>
            <DropdownItem onClick={this.toggleRename}>Rename Slide</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown isOpen={this.state.insertOpen} toggle={this.toggleInsert}>
          <DropdownToggle caret>
            Insert
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.props.addToStack} value="Title">Title</DropdownItem>
            <DropdownItem onClick={this.props.addToStack} value="Textbox">Textbox</DropdownItem>
            <DropdownItem onClick={this.props.addToStack} value="Image">Image</DropdownItem>
            <DropdownItem onClick={this.props.addToStack} value="Quiz">Quiz</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </ButtonGroup>
      {modal}
    </div>
    )
  }

}

NavBar.propTypes = {
  save: PropTypes.func,
  insertSlide: PropTypes.func,
  deleteSlide: PropTypes.func,
  renameSlide: PropTypes.func
}
