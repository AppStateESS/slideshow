import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, CardImg, Button } from 'reactstrap'

export default class ShowCard extends Component {
  constructor() {
    super()
      this.state = {
        show: {
          title: null,
          img: null,
        }
      }
      this.loadShow = this.loadShow.bind(this)
      this.view = this.view.bind(this)
      this.edit = this.edit.bind(this)
  }

  componentDidMount() {
    this.loadShow(this.props.id)
  }

/**
* Loads the details fome the back end - see Show.php
*/
 loadShow(id) {
   if (id != -1) {
     $.getJSON('./slideshow/show/admin/getDetails', {show_id: id}).done(function (data) {
       this.setState({show: data})
     }.bind(this))
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

 }

  render() {
    return (
      <div>
        <Card>
          <CardImg top-width="100%" src={this.state.show.img}/>
          <CardBody>
            <CardTitle>{this.state.show.title}</CardTitle>
            <Button onClick={this.view} color="primary">Present</Button>
            <Button onClick={this.edit} color="secondary">Edit</Button>
          </CardBody>
        </Card>
      </div>
    )
  }

}

ShowCard.propTypes = {
  id: PropTypes.number
}
