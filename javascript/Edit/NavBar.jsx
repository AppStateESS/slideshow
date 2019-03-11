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
      imageOpen: false,
      renameVal: ""
    }

    this.toggleFile = this.toggleFile.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.toggleInsert = this.toggleInsert.bind(this)
    this.toggleRename = this.toggleRename.bind(this)
    this.toggleImage = this.toggleImage.bind(this)
    this.handleRename = this.handleRename.bind(this)
    this.renameCurrentSlide = this.renameCurrentSlide.bind(this)
    this.handlePresent = this.handlePresent.bind(this)
    this.handleImage = this.handleImage.bind(this)
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

  toggleImage() {
    this.setState({
      imageOpen: !this.state.imageOpen
    })
  }

  handleRename(event) {
    this.setState({
      renameVal: event.target.value
    })
  }

  handleImage(event) {
    this.setState({
      imageUrl: event.target.value
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

  handlePresent() {
    window.sessionStorage.setItem('id', this.props.id)
    window.location.href = './slideshow/Show/Present/?id=' + this.props.id
  }


  render() {
    const imageModal = (
      <Modal isOpen={this.state.imageOpen} toggle={this.toggleImage} fade={false} backdrop={true}>
        <ModalHeader toggle={this.toggleImage}>Enter Image Url</ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input
                    type="text"
                    placeholder="Image Url"
                    onChange={this.handleImage}
                    value={this.state.imageUrl} />
              <InputGroupAddon addonType="append">
            <Button onClick={this.toggleImage} color="primary">Submit</Button>
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
            <DropdownItem onClick={this.handlePresent}>Present</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown isOpen={this.state.editOpen} toggle={this.toggleEdit}>
          <DropdownToggle caret>
            Edit
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.props.insertSlide}>Insert Slide</DropdownItem>
            <DropdownItem onClick={this.props.deleteSlide}>Delete Slide</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <ButtonDropdown isOpen={this.state.insertOpen} toggle={this.toggleInsert}>
          <DropdownToggle caret>
            Insert
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem value="Image" onClick={this.toggleImage}>Image</DropdownItem>
            <DropdownItem value="Quiz">Quiz</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={this.props.insertSlide}>New Slide</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </ButtonGroup>
      {imageModal}
    </div>
    )
  }

}

NavBar.propTypes = {
  save: PropTypes.func,
  insertSlide: PropTypes.func,
  deleteSlide: PropTypes.func,
  renameSlide: PropTypes.func,
  currentSlide: PropTypes.number
}
