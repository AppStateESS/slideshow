import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, CardImg, Button } from 'reactstrap'

export default class ShowCard extends Component {
  constructor() {
    super()
      this.state = {
          id: -1,
          title: null,
          img: "https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180",
          active: 0,
          color: "danger"
      }
      this.loadShow = this.loadShow.bind(this)
      this.view = this.view.bind(this)
      this.edit = this.edit.bind(this)
  }

  componentDidMount() {
    //console.log(this.props.title);
    //this.loadShow(this.props.id)
    this.setState({

          title: this.props.title,
          //img: this.props.img,
          active: this.props.active,
          id: this.props.id

    })
  }

/**
* Loads the details fome the back end - see Show.php
*/
 loadShow(id) {
   console.log("Made it");
   if (id !== -1) {
     $.getJSON('./slideshow/show/admin/getDetails', {show_id: id}).done(function (data) {
       this.setState({show: data})
     }.bind(this))

     this.setState({
       show: {
         title: "Fake Data Placeholder",
         img: "https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
       }
     })
   }
   else {
     this.setState({
       show: {
         title: "Test Show",
         img: "https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
       }
     })
   }
 }

 view() {

 }

 edit() {
   console.log("made it");
 }

  render() {
    return (
      <div style={{paddingBottom: "25px"}}>
        <Card>
          <CardImg top-width="100%" src={this.state.img}/>
          <CardBody>
            <CardTitle className="d-flex justify-content-center">
              {this.state.title}
              <a onClick={this.edit} style={{paddingLeft: "10px"}}> <i className="fas fa-edit fa-sm"></i> </a>
            </CardTitle>
            <div className="d-flex justify-content-around">
              <Button onClick={this.view} color="primary">Present</Button>
              <Button onClick={this.edit} color="secondary">Edit</Button>
              <Button onClick={this.active} color={this.state.color}>{this.state.active}</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

}

// ShowCard.propTypes = {
//   id: PropTypes.number
// }
