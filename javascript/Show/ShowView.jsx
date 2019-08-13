'use strict'
import React, {Component} from 'react'
import ShowCard from './ShowCard.jsx'
import Show from '../Resources/Show.js'
import {
  CardDeck,
  Modal,
  } from 'react-bootstrap'

export default class ShowView extends Component {
  constructor() {
      super()
      this.state = {
        resource: Show,
        showData: null,
        modalOpen: false,
        newShowFocus: false
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
    if (this.state.resource.title != undefined) {
      // new show
      $.ajax({
        url: './slideshow/Show',
        data: this.state.resource,
        type: 'post',
        dataType: 'json',
        success: function(showId) {
          window.sessionStorage.setItem('id', showId)
          window.setInterval(() => window.location.href = './slideshow/Slide/Edit', 100)
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
            New Show
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="input" 
            className="form-control" 
            placeholder="Enter a title" 
            onChange={this.updateTitle}
            onKeyDown={this.handleKeyDown}
            style={{textAlign: 'center'}}>
          </input>
          <br></br>
          <button className="btn btn-success btn-block" onClick={this.saveNewShow}>Save</button>
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
             load={this.getData}
             img={show.preview} />
         )}.bind(this)
      );

      return (
        <div>
          <h2>Shows</h2>
          <div className="jumbotron">
            <CardDeck className="card-deck d-flex justify-content-center">
              {cards}
            </CardDeck>
            <hr />
            <div className="col">
              <div className="card text-center" 
                onClick={this.toggleNewSlide} 
                onMouseEnter={() => this.setState({newShowFocus: true})}
                onMouseLeave={() => this.setState({newShowFocus: false})} 
                style={(this.state.newShowFocus) ? {border: 'solid 3px #337ab7', color: '#337ab7'} : {border: 'solid 3px white', color: 'dimgrey' }}>
                <div className="card-body">
                  <h5>Create New Show</h5>
                  <i className="fas fa-plus-circle" style={{fontSize: 30}}></i>
                </div>
              </div>
            </div>
          </div>
          {modal}
        </div>
      )
    }
  }
}
