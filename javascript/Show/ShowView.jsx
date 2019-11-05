'use strict'
import React, { Component } from 'react'
import ShowCard from './ShowCard.jsx'
import Show from '../Resources/Show.js'
import './custom.css'
import {
  Modal,
} from 'react-bootstrap'
import { fuzzySearch } from '../Resources/Search.js'

export default class ShowView extends Component {
  constructor() {
    super()
    this.state = {
      resource: Show,
      showData: null,
      modalOpen: false,
      newShowFocus: false,
      alphaFilter: true,
      activeFilter: false,
      newFilter: false
    }

    this.getData = this.getData.bind(this)
    this.saveNewShow = this.saveNewShow.bind(this)
    this.toggleNewSlide = this.toggleNewSlide.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.handleKeyDown = this._handleKeyDown.bind(this)
    this.sortShow = this.sortShow.bind(this)
    this.handleActive = this.handleActive.bind(this)
    this.handleAlpha = this.handleAlpha.bind(this)
    this.handleNew = this.handleNew.bind(this)
    this.searchTitle = this.searchTitle.bind(this)
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
        success: function (showId) {
          window.sessionStorage.setItem('id', showId)
          window.location.href = './slideshow/Slide/Edit'
        }.bind(this),
        error: function (req, err) {
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
    this.setState({ modalOpen: !this.state.modalOpen })
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
      success: function (data) {
        this.setState({ showData: data['listing'] });
      }.bind(this),
      error: function (req, err) {
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

  sortShow(inv, id) {
    let showD = [...this.state.showData]
    if (!inv) {
      if (id == 5) {
        showD.sort((a, b) => b.id - a.id)
      } else if (id == 1) {
        showD.sort((a, b) => a.title.localeCompare(b.title))
      } else if (id == 3) {
        showD.sort((a, b) => b.active - a.active)
      }

    } else {
      if (id == 6) {
        showD.sort((a, b) => a.id - b.id)
      } else if (id == 2) {
        showD.sort((a, b) => b.title.localeCompare(a.title))
      } else if (id == 4) {
        showD.sort((a, b) => a.active - b.active)
      }
      this.setState({ newFilter: false, activeFilter: false, alphaFilter: false })
    }
    this.setState({ showData: showD })
  }

  handleAlpha(event) {
    if (event.target.id == 1) {
      this.sortShow(true, 2)
    } else {
      this.setState({ alphaFilter: true, newFilter: false, activeFilter: false }, this.sortShow(false, 1))
    }
  }

  handleActive(event) {
    if (event.target.id == 3) {
      this.sortShow(true, 4)
    } else {
      this.setState({ activeFilter: true, alphaFilter: false, newFilter: false }, this.sortShow(false, 3))
    }
  }

  handleNew(event) {
    if (event.target.id == 5) {
      this.sortShow(true, 6)
    } else {
      this.setState({ newFilter: true, alphaFilter: false, activeFilter: false }, this.sortShow(false, 5))
    }
  }


  searchTitle(event) {
    let showD = [...this.state.showData]
    //a is user typed search value
    let a = event.target.value.toUpperCase()
    for (let f = 0; f < showD.length; f++) {
      showD[f].disabled = true
      let b = showD[f].title.toUpperCase()

      const weight = fuzzySearch(a, b)
      if (weight != null && weight.score >= -45) {
        showD[f].disabled = false
      } else if (a.length == 0) {
        showD[f].disabled = false
      }
    }
    this.setState({ showData: showD })


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
            style={{ textAlign: 'center' }}>
          </input>
          <br></br>
          <button className="btn btn-success btn-block" onClick={this.saveNewShow}>Save</button>
        </Modal.Body>
      </Modal>
    )

    if (this.state.showData === null) {
      return (<div></div>)
    } else {
      let cards = this.state.showData.map(function (show) {
        return (
          <ShowCard
            key={show.id}
            id={show.id}
            title={show.title}
            active={show.active}
            load={this.getData}
            img={show.preview}
            disabled={show.disabled} />
        )
      }.bind(this)
      );

      let dropDownItems = (
        <div>
          <button id={this.state.alphaFilter ? 1 : 2} className="dropdown-item" onClick={this.handleAlpha} type="button">{this.state.alphaFilter ? 'Z-A' : 'A-Z'}</button>
          <button id={this.state.activeFilter ? 3 : 4} className="dropdown-item" onClick={this.handleActive} type="button">{this.state.activeFilter ? 'Inactive' : 'Active'}</button>
          <button id={this.state.newFilter ? 5 : 6} className="dropdown-item" onClick={this.handleNew} type="button">{this.state.newFilter ? 'Oldest' : 'Newest'}</button>
        </div>
      )

      return (
        <div>
          <h2>Shows</h2>
          <div className="input-group mb-3 searchBar">
            <input type="text" className="form-control" onChange={this.searchTitle} placeholder="Search a slide show title" aria-label="Search a Slide name" aria-describedby="button-addon2"></input>
          </div>
          <div className="jumbotron">
            <div className="dropdown sortCards">
              <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Sort by
            </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                {dropDownItems}
              </div>
            </div>
            <div className="card-deck d-flex justify-content-center">
              {cards}
            </div>
            <hr />
            <div className="col">
              <div className="card text-center"
                onClick={this.toggleNewSlide}
                onMouseEnter={() => this.setState({ newShowFocus: true })}
                onMouseLeave={() => this.setState({ newShowFocus: false })}
                style={(this.state.newShowFocus) ? { border: 'solid 3px #337ab7', color: '#337ab7', cursor: 'pointer' } : { border: 'solid 3px white', color: 'dimgrey' }}>
                <div className="card-body">
                  <h5>Create New Show</h5>
                  <i className="fas fa-plus-circle" style={{ fontSize: 30 }}></i>
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
