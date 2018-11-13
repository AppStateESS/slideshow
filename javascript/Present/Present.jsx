'use strict'
import React, { Component } from 'react'
import PresentView from './PresentView.jsx'

export default class Present extends Component {
  constructor() {
    super()

    this.state = {
      currentSlide: 0,
      content: [
        {
          stack: []
        }
      ],
      slideName: "Present: ",
    }
    this.load = this.load.bind(this)

    this.prev = this._prev.bind(this)
    this.next = this._next.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  load() {
    $.ajax({
      url: './slideshow/Show/present/?id=' + window.sessionStorage.getItem('id'),
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        let loaded = data['slides']
        if (loaded[this.state.currentSlide] != undefined) {
          this.setState({
            content: loaded
          });
        }
      }.bind(this),
      error: function(req, err) {
        alert("Failed to load data.")
        console.error(req, err.toString());
      }.bind(this)
    });
  }

  changeSlide(slideNum) {
    this.setState({
      currentSlide: slideNum
    })
  }

  _prev() {
    if (this.state.currentSlide != 0) {
      this.changeSlide(this.state.currentSlide - 1)
    }
  }

  _next() {
    if (this.state.currentSlide != this.state.content.length - 1) {
      this.changeSlide(this.state.currentSlide + 1)
    }
  }

  render() {
    let inc = 0
    let slidesButtons = this.state.content.map(function(slide) {
      inc += 1
      if (inc - 1 == this.state.currentSlide) {
        return (
          <button className="btn btn-primary">{inc}</button>
        )
      }
      else {
        return (
          <button className="btn btn-secondary" onClick={this.changeSlide.bind(this,inc-1)}>{inc}</button>
        )
      }
    }.bind(this));
    return(
      <div>
        <h1>{this.state.slideName}</h1>
        <br></br>
        <div>
          <PresentView
            currentSlide={this.state.currentSlide}
            content={this.state.content[this.state.currentSlide].stack} />
        </div>
        <div>
          <div className="btn-toolbar">
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={this.prev}>Previous</button>
              {slidesButtons}
              <button className="btn btn-secondary" onClick={this.next}>Next</button>
            </div>
          </div>
        </div>
        <div>

        </div>
      </div>
    )
  }
}
