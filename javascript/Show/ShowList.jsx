import React, {Component} from 'react'

export default class ShowList extends Component {
  constructor() {
    super()
    this.state = {
    }
    this.getShows = this.getShows.bind(this)
    this.pullShows = this.pullShows.bind(this)
  }

  /**
  * Pulls all the shows from the back-end
  */
  pullShows() {
    let shows
    $.get()
    return new array()
  }

  getShows() {
    let shows = pullShows()
    if (shows === null) {
      // Add a way to handle this or not.
    } else {
      cards = shows.map(function (id) {
        return <ShowCard id={id}/>
      }.bind(this))
    }

    return (
      <div>
        {cards}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.getShows}
      </div>
    )
  }
}
