import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, CardImg, Button, Alert } from 'reactstrap'
import './custom.css'

import AppLogo from "../../img/showimg.png"

export default class ShowCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
        img: AppLogo,
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
  }

  presentTransition() {
    window.sessionStorage.setItem('id', this.props.id)
    window.location.href = './slideshow/Show/Present/?id=' + this.props.id
  }

  getSessionInfo() {
    $.ajax({
      url: './slideshow/Session/' + this.props.id,
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        console.log(this.props.id)
        console.log(data)
        console.log(data.highestSlide)
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
        present = <Button onClick={this.presentTransition} color="primary">Begin</Button>
        break;
      case 1:
        present = <Button onClick={this.presentTransition} color="warning">Continue</Button>
        break;
      case 2:
        present = <Button onClick={this.presentTransition} color="success" >Review</Button>
        break;
    }

    return (
      <div style={{paddingBottom: "25px"}}>
        <Card>
          <div className="card-img-caption">
            <img className="card-img-top" src={this.state.img}/>
          </div>
          <CardBody>
            <CardTitle className="d-flex justify-content-center">
              {this.props.title}
            </CardTitle>
            <div className="d-flex justify-content-around">
              {present}
            </div>
          </CardBody>
        </Card>
      </div>
    )
}

}

ShowCard.propTypes = {
   //id: PropTypes.string,
   title: PropTypes.string,
   //active: PropTypes.number,
   //load: PropTypes.function
 }
