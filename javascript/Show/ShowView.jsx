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
      this.successMessage = this.message.bind(this)
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
<<<<<<< 90d1b2dee082f26120dc33babcb5e9859dedbc0f

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
  }

    /* This should redirect the user to the edit page.
    load() {
      $.get({

      })
    }*/

    message() {
      alert("New SlideShow Created!")
    }
=======

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
  }
>>>>>>> Work in progress, get and post work.

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
<<<<<<< eed3d14aef61f328075b18766ed6d9a557bab405
<<<<<<< 90d1b2dee082f26120dc33babcb5e9859dedbc0f
=======
>>>>>>> Everything works except changing the image.
      let cards = this.state.showData.map(function(show) {
        return(
          <ShowCard
             key={show.id}
             id={show.id}
             title={show.title}
             active={show.active}
             load={this.getData} />
         )}.bind(this)
<<<<<<< eed3d14aef61f328075b18766ed6d9a557bab405
=======
      let cards = this.state.showData.map(show => {
          return(
           <ShowCard key={show.id} id={show.id} title={show.title} active={show.active} />
          )}
>>>>>>> Work in progress, get and post work.
=======
>>>>>>> Everything works except changing the image.
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
