import React, {Component} from 'react'
export default class ShowCard extends Component {
  constructor() {
      this.state = {
        show: {
          id: 0,
          title: null,
          img: null,
        }
      }

      this.loadShow = this.loadShow.bind(this)
  }

/**
* Loads the details fome the back end - see Show.php
*/
 loadShow(id) {
   $.getJSON('./slideshow/show/admin/getDetails', {show_id: id}).done(function (data) {
     this.setState({show: data})
   }.bind(this))
 }

  render() {
    const id = this.props.id
    return (
      <div class="card" style="width: 18rem;">
        <img class="card-img-bottom" src={this.state.show.img} >
        <div class="card-body">
            <h5>{this.state.show.title}</h5>
            <a class="btn btn-success">View</a>
            <a class="btn btn-primary">Edit</a>
        </div>
      </div>
    )
  }
}
