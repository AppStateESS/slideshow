'use strict'
import React, {Component} from 'react'
import ShowCard from './ShowCard.jsx'
import Show from '../Resources/Show.js'
import './custom.css'
import {Modal} from 'react-bootstrap'
import {fuzzySearch} from '../Resources/Search.js'

/* global $ */

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
      newFilter: false,
      inv: ['a-z', ''], //last modified is the first spot, second index is last click
      loaded: false,
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.inv[1] != '') {
      this.sortShow()
    }
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
          alert('Failed to save data.')
          console.error(req, err.toString())
        }.bind(this),
      })
    } else {
      alert('Title cannot be empty')
    }
  }

  toggleNewSlide() {
    this.setState({modalOpen: !this.state.modalOpen})
  }

  updateTitle(event) {
    let r = this.state.resource
    r.title = event.target.value
    this.setState({
      resource: r,
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
        let inver = this.state.loaded ? 'active' : 'a-z'
        if (this.state.loaded) {
          if (this.state.inv[0] === 'active') {
            inver = 'active'
          } else if (this.state.inv[0] === 'inactive') {
            inver = 'inactive'
          }
        }
        this.setState(
          {showData: data['listing'], loaded: true, inv: [inver, '']},
          () => this.sortShow()
        )
      }.bind(this),
      error: function (req, err) {
        alert('Failed to grab data')
        console.error(req, err.toString())
      }.bind(this),
    })
  }

  _handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.saveNewShow()
    }
  }

  sortShow() {
    let showD = [...this.state.showData]
    if (this.state.inv[0] !== this.state.inv[1]) {
      if (this.state.inv[1] === 'newest') {
        showD.sort((a, b) => b.id - a.id)
      } else if (this.state.inv[1] === 'a-z') {
        showD.sort((a, b) => a.title.localeCompare(b.title))
      } else if (
        this.state.inv[1] === 'active' ||
        this.state.inv[0] === 'active'
      ) {
        showD.sort((a, b) => b.active - a.active)
      } else if (this.state.inv[0] === 'inactive') {
        showD.sort((a, b) => a.active - b.active)
      }
      this.setState({inv: [this.state.inv[1], '']})
    } else {
      if (this.state.inv[0] === 'oldest') {
        showD.sort((a, b) => a.id - b.id)
      } else if (this.state.inv[0] === 'z-a') {
        showD.sort((a, b) => b.title.localeCompare(a.title))
      } else if (this.state.inv[0] === 'inactive') {
        showD.sort((a, b) => a.active - b.active)
      }
      this.setState({
        newFilter: false,
        activeFilter: false,
        alphaFilter: false,
        inv: [this.state.inv[0], ''],
      })
    }
    this.setState({showData: showD})
  }

  handleAlpha(event) {
    if (event.target.id !== 'a-z') {
      this.setState({
        alphaFilter: true,
        newFilter: false,
        activeFilter: false,
        inv: [this.state.inv[0], 'a-z'],
      })
    } else {
      this.setState({
        alphaFilter: true,
        newFilter: false,
        activeFilter: false,
        inv: ['z-a', 'z-a'],
      })
    }
  }

  handleActive(event) {
    if (event.target.id === 'inactive') {
      this.setState({
        alphaFilter: false,
        newFilter: false,
        activeFilter: true,
        inv: [this.state.inv[0], 'active'],
      })
    } else {
      this.setState({
        alphaFilter: false,
        newFilter: false,
        activeFilter: true,
        inv: ['inactive', 'inactive'],
      })
    }
  }

  handleNew(event) {
    if (event.target.id !== 'newest') {
      this.setState({
        alphaFilter: false,
        newFilter: true,
        activeFilter: false,
        inv: [this.state.inv[0], 'newest'],
      })
    } else {
      this.setState({
        alphaFilter: false,
        newFilter: true,
        activeFilter: false,
        inv: ['oldest', 'oldest'],
      })
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
      if (weight != null && weight.score >= -60) {
        showD[f].disabled = false
      } else if (a.length == 0) {
        showD[f].disabled = false
      } else if (a.length == 1 && weight != null && weight.score >= -70) {
        showD[f].disabled = false
      }
    }
    this.setState({showData: showD})
  }

  render() {
    const modal = (
      <Modal show={this.state.modalOpen} onHide={this.toggleNewSlide}>
        <Modal.Header closeButton>
          <Modal.Title>New Show</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="input"
            className="form-control"
            placeholder="Enter a title"
            onChange={this.updateTitle}
            onKeyDown={this.handleKeyDown}
            style={{textAlign: 'center'}}></input>
          <br></br>
          <button
            className="btn btn-success btn-block"
            onClick={this.saveNewShow}>
            Save
          </button>
        </Modal.Body>
      </Modal>
    )

    if (this.state.showData === null) {
      return <div></div>
    } else {
      let cards = this.state.showData.map(
        function (show) {
          return (
            <ShowCard
              key={show.id}
              id={show.id}
              title={show.title}
              active={show.active}
              load={this.getData}
              img={show.preview}
              disabled={show.disabled}
            />
          )
        }.bind(this)
      )

      let dropDownItems = (
        <div>
          <button
            id={this.state.alphaFilter ? 'a-z' : 'z-a'}
            className="dropdown-item"
            onClick={this.handleAlpha}
            type="button">
            {this.state.alphaFilter ? 'Z-A' : 'A-Z'}
          </button>
          <button
            id={this.state.activeFilter ? 'active' : 'inactive'}
            className="dropdown-item"
            onClick={this.handleActive}
            type="button">
            {this.state.activeFilter ? 'Inactive' : 'Active'}
          </button>
          <button
            id={this.state.newFilter ? 'newest' : 'oldest'}
            className="dropdown-item"
            onClick={this.handleNew}
            type="button">
            {this.state.newFilter ? 'Oldest' : 'Newest'}
          </button>
        </div>
      )
      let cardStyle = {border: 'solid 3px white', color: 'dimgrey'}
      if (this.state.newShowFocus) {
        cardStyle = {
          border: 'solid 3px #337ab7',
          color: '#337ab7',
          cursor: 'pointer',
        }
      }
      return (
        <div>
          <h2>Shows</h2>
          <div className="input-group mb-3 searchBar">
            <input
              type="text"
              className="form-control"
              onChange={this.searchTitle}
              placeholder="Search a title"
              aria-label="Search a Slide name"
              aria-describedby="button-addon2"></input>
          </div>
          <div className="jumbotron">
            <div className="dropdown sortCards">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenu2"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
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
              <div
                className="card text-center"
                onClick={this.toggleNewSlide}
                onMouseEnter={() => this.setState({newShowFocus: true})}
                onMouseLeave={() => this.setState({newShowFocus: false})}
                style={cardStyle}>
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
