'use strict'
import React, {Component} from 'react'
import ShowCard from './ShowCard.jsx'
import Show from '../Resources/Show.js'
import {
  Card,
  CardDeck,
  Jumbotron,
  Button,
  Col,
  Modal,
  } from 'react-bootstrap'

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
      this.toggleNewSlide = this.toggleNewSlide.bind(this)
      this.updateTitle = this.updateTitle.bind(this)
      this.handleKeyDown = this._handleKeyDown.bind(this)
    }

  componentDidMount() {
    this.getData()
  }

  saveNewShow() {
    console.log(this.state.resource.title)
    if (this.state.resource.title != undefined) {
      // new show
      $.ajax({
        url: './slideshow/Show',
        data: this.state.resource,
        type: 'post',
        dataType: 'json',
        success: function(showId) {
          window.sessionStorage.setItem('id', showId)
          window.setInterval(() => window.location.href = './slideshow/Slide/Edit', 200)
        }.bind(this),
        error: function(req, err) {
          alert("Failed to save data.")
          console.error(req, err.toString());
        }.bind(this)
      });
    }
    else {
      alert("Title cannot be empty")
    }
  }

  toggleNewSlide() {
    this.setState({modalOpen: !this.state.modalOpen})
  }

  updateTitle(event) {
    let r = this.state.resource
    r.title = event.target.value
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
        alert("Failed to grab data")
        console.error(req, err.toString());
      }.bind(this)
    });
  }

  _handleKeyDown(event) {
    if (event.key === "Enter") {
      this.saveNewShow()
    }
  }

  render() {

    const modal = (
      <Modal
        show={this.state.modalOpen}
        onHide={this.toggleNewSlide}
        >
        <Modal.Header closeButton>
          <Modal.Title>
            Enter a Title:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="input-group mb-3">
              <input type="input" 
                className="form-control" 
                placeholder="New Show" 
                onChange={this.updateTitle}
                onKeyDown={this.handleKeyDown}>
              </input>
              <div className="input-group-append">
                <button type="button" className="btn btn-success"onClick={this.saveNewShow}>Save</button>
              </div>
            </div>
        </Modal.Body>
      </Modal>
    )

    if (this.state.showData === null)
    {
      return(<div></div>)
    } else {
      let cards = this.state.showData.map(function(show) {
        return(
          <ShowCard
             key={show.id}
             id={show.id}
             title={show.title}
             active={show.active}
             load={this.getData} />
         )}.bind(this)
      );

      return (
        <div>
          <h2>Shows:</h2>
          <Jumbotron>
            <CardDeck className="card-deck d-flex justify-content-center">
              {cards}
            </CardDeck>
            <hr />
            <Col>
              <Card body className="text-center">
                <Card.Body>
                  <Card.Title>Create New Show</Card.Title>
                  <Button variant="outline-primary" onClick={this.toggleNewSlide} color="primary">
                    <i className="fas fa-plus-circle"></i>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Jumbotron>
          {modal}
        </div>
      )
    }
  }
}
