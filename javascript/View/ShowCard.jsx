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
    }

    this.presentTransition = this.presentTransition.bind(this)
  }

  editTransition() {
   window.sessionStorage.setItem('id', this.props.id)
   window.location.href = './slideshow/Show/Edit/?id=' + this.props.id
  }

  presentTransition() {
    window.sessionStorage.setItem('id', this.props.id)
    window.location.href = './slideshow/Show/Present/?id=' + this.props.id
  }


  render() {
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
              <Button onClick={this.presentTransition} color="warning">Complete</Button>
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
