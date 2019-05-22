'use strict'
import React, {Component} from 'react'
import ShowCard from './ShowCard.jsx'
import Show from '../Resources/Show.js'

export default class ShowView extends Component {
  constructor() {
      super()
      this.state = {
        resource: Show,
        showData: null,
      }

      this.getData     = this.getData.bind(this)
    }

  componentDidMount() {
    this.getData();
  }


  /**
  * Pulls all the shows from the back-end
  */
  getData() {
    $.ajax({
      url: './slideshow/Show',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        this.setState({showData: data['listing']});
      }.bind(this),
      error: function(req, err) {

                //alert("Failed to grab data.")
        console.error(req, err.toString());
      }.bind(this)
    });
  }


  render() {
    let cards = undefined
    if (this.state.showData !== null) {
     cards = this.state.showData.map(function(show) {
        if (show.active == 1) {
          return(
            <ShowCard
               key={show.id}
               id={show.id}
               title={show.title}
               load={this.getData} />
           )
         }}.bind(this)
      )
    }

    return (
      <div>
        <h2>Shows:</h2>
        <div className="jumbotron">
          <div className="card-deck d-flex justify-content-center">
            {cards}
          </div>
        </div>
      </div>
    )
  }
}
