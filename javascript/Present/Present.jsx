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

  render() {
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

        </div>
      </div>
    )
  }
}
