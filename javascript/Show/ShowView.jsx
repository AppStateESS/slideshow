'use strict'
import React, {Component} from 'react'
import ShowList from './ShowList.jsx'
import ShowCard from './ShowCard.jsx'
import { Card, CardBody, CardTitle, Row, Col, Button } from 'reactstrap'
import { Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon } from 'reactstrap'

export default class ShowView extends Component {
  constructor() {
      super()
      this.state = {
        modalOpen: false,
        title: ""
      }

      //this.load = this.load.bind(this)
      this.saveNewShow = this.saveNewShow.bind(this)
      this.switchModal = this.switchModal.bind(this)
      this.successMessage = this.message.bind(this)
      this.updateTitle = this.updateTitle.bind(this)
    }

    saveNewShow(title) {
      if (this.state.title != null) {
        $.ajax({
          url: 'slideshow/Show',
          data: {
            title: this.state.title
          },
          dataType: 'json',
          type: 'post',
          success: () => {
            this.switchModal(),
            this.message(),
            this.load()
          },
          error: () => {
            alert('Sorry, but this slideshow cannot be created.')
          },
        })
      }
    }

    switchModal() {
      this.setState({
        modalOpen: !this.state.modalOpen
      })
    }

    updateTitle(event) {
      this.setState({
        title: event.target.value
      })
    }

    /* This should redirect the user to the edit page.
    load() {
      $.get({

      })
    }*/

    message() {
      alert("New SlideShow Created!")
    }

  render() {

    const modal = (
      <Modal isOpen={this.state.modalOpen} toggle={this.switchModal} fade={false} backdrop={true}>
        <ModalHeader toggle={this.switchModal} >Enter a Title:</ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input
                    type="text"
                    placeholder="New Show"
                    onChange={this.updateTitle}
                    value={this.state.title} />
              <InputGroupAddon addonType="append">
            <Button onClick={this.saveNewShow} color="success">Save</Button>
            </InputGroupAddon>
          </InputGroup>
        </ModalBody>
      </Modal>
    )

    const newShow = (
      <Card body className="text-center">
        <CardBody>
          <CardTitle>Create New Show</CardTitle>
          <Button onClick={this.switchModal} color="secondary">+</Button>
        </CardBody>
      </Card>
    )

    return (
      <div>
        <h2>Shows:</h2>
        <div className="jumbotron">
          <div className="card-deck">
            <ShowList />
            <ShowCard id={-1} />
            <ShowCard id={-1} />
            <ShowCard id={-1} />
          </div>
          <hr />
          <Col>{newShow}</Col>
        </div>
        {modal}
      </div>
    )
  }
}
