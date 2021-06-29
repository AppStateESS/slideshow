import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './custom.css'

import AppLogo from '../../img/showimg.png'

/* global $ */

export default class ShowCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      img: props.preview,
      active: 0,
      sessionFlag: 0,
    }

    this.getSessionInfo = this.getSessionInfo.bind(this)
    this.presentTransition = this.presentTransition.bind(this)
  }

  componentDidMount() {
    this.getSessionInfo()
    if (this.props.preview.length == 0) {
      this.setState({img: AppLogo})
    }
  }

  presentTransition() {
    window.sessionStorage.setItem('id', this.props.id)
    window.location.href = './slideshow/Slide/Present/'
  }

  getSessionInfo() {
    $.ajax({
      url: './slideshow/Session/' + this.props.id,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        let session = 0
        if (Number(data.completed)) {
          session = 2 // Review
        } else if (Number(data.highestSlide) > 0) {
          session = 1 // continue
        }

        this.setState({
          sessionFlag: session,
        })
      }.bind(this),
    })
  }

  render() {
    let present = undefined
    switch (this.state.sessionFlag) {
      case 0:
        present = (
          <button
            onClick={this.presentTransition}
            className="btn btn-primary btn-block">
            Begin
          </button>
        )
        break
      case 1:
        present = (
          <button
            onClick={this.presentTransition}
            className="btn btn-warning btn-block">
            Continue
          </button>
        )
        break
      case 2:
        present = (
          <button
            onClick={this.presentTransition}
            className="btn btn-success btn-block">
            Review
          </button>
        )
        break
    }

    return (
      <div style={{paddingBottom: '25px'}}>
        <div className="card">
          <div className="card-img-caption">
            <img className="card-img-top" src={this.state.img} />
          </div>
          <div className="card-body">
            <div className="card-title">
              <div className="d-flex justify-content-center">
                <h5>{this.props.title}</h5>
              </div>
            </div>
            <div className="d-flex justify-content-around">{present}</div>
          </div>
        </div>
      </div>
    )
  }
}
ShowCard.propTypes = {
  preview: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.number,
}
