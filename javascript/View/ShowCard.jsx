import React, {Component} from 'react'

import Tippy from '@tippy.js/react'
import './custom.css'

import AppLogo from "../../img/showimg.png"

export default class ShowCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
        img: props.preview,
        active: 0,
        sessionFlag: 0 // case 0: begin/start
                      // case 1: continue
                      // case 2: review
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
        }
        else if (Number(data.highestSlide) > 0) {
          session = 1 // continue
        }

        this.setState({
          sessionFlag: session
        })
      }.bind(this)
    })
  }


  render() {

    let present = undefined
    switch (this.state.sessionFlag) {
      case 0:
        present = <button onClick={this.presentTransition} className="btn btn-primary btn-block" >Begin</button>
        break;
      case 1:
        present =
        <Tippy placement="bottom" content={<div>Incomplete. Click to continue</div>} arrow={true}>
            <button onClick={this.presentTransition} className="btn btn-warning btn-block" >Continue</button>
        </Tippy>
        break;
      case 2:
        present =
        <Tippy placement="bottom" content={<div>Completed. Click to review</div>} arrow={true}>
            <button onClick={this.presentTransition} className="btn btn-success btn-block" >Review</button>
        </Tippy>
        break;
    }

    return (
      <div style={{paddingBottom: "25px"}}>
        <div className="card">
          <div className="card-img-caption">
            <img className="card-img-top" src={this.state.img}/>
          </div>
          <div className="card-body">
            <div className="card-title">
              <div className="d-flex justify-content-center">
                <h5>{this.props.title}</h5>
              </div>
            </div>
            <div className="d-flex justify-content-around">
              {present}
            </div>
          </div>
        </div>
      </div>
    )
}

}
