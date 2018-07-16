'use strict'
import React, {Component} from 'react'
import ShowList from './ShowList.jsx'
import ShowCard from './ShowCard.jsx'
import Show from '../Resources/Show.js'
import { Card, CardBody, CardTitle, Row, Col, Button } from 'reactstrap'
import { Modal, ModalHeader, ModalBody, Input, InputGroup, InputGroupAddon } from 'reactstrap'

export default class ShowView extends Component {
  constructor() {
      super()
      this.state = {
        resource: Show,
        showData: null,
        modalOpen: false
      }

      this.getData     = this.getData.bind(this)
      this.saveNewShow = this.saveNewShow.bind(this)
      this.switchModal = this.switchModal.bind(this)
      this.updateTitle = this.updateTitle.bind(this)
    }

  componentDidMount() {
    this.getData();
  }

  saveNewShow() {
    if (this.state.resource.title != null) {
      $.ajax({
        url: './slideshow/Show',
        data: this.state.resource,
        type: 'post',
        dataType: 'json',
        success: function() {
          this.getData();
        }.bind(this),
        error: function(req, err) {
          alert("Failed to save data.")
          console.error(req, err.toString());
        }.bind(this)
      });
    }
  }

  switchModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  updateTitle(event) {
    let r = this.state.resource;
    r.title = event.target.value;
    this.setState({
      resource: r
    })
  }

  /**
  * Pulls all the shows from the back-end
  */
  getData() {
    $.ajax({
      url: './slideshow/Show',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        this.setState({showData: data['listing']});
      }.bind(this),
      error: function(req, err) {

                //alert("Failed to grab data.")
        console.error(req, err.toString());
      }.bind(this)
    });
    //let fakeData = {"id": "1"}
    //this.setState({data: fakeData})
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
                    value={this.state.resource.title} />
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

    if (this.state.showData === null)
    {
      // return (
      //   <div>
      //     <i className="fas fa-spinner fa-spin"></i>
      //   </div>
      // )
      return(<div></div>)
    } else {
      let cards = this.state.showData.map(show => {
          return(
           <ShowCard key={show.id} id={show.id} title={show.title} active={show.active} />
          )}
      );

      //let cards = <ShowCard id={1} {cards}/>
      return (
        <div>
          <h2>Shows:</h2>
          <div className="jumbotron">
            <div className="card-deck d-flex justify-content-center">
              {cards}
            </div>
            <hr />
            <Col>{newShow}</Col>
          </div>
          {modal}
        </div>
      )
    }
  }
}
