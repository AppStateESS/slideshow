import React, {Component} from 'react'

export default class ShowList extends Component{
  constructor() {
    super()
    this.state = {
      showsList: getShows()
    }
    this.getShows = this.getShows.bind(this)
  }

  getShows() {
    let shows

    if (this.props.shows === null || this.props.shows.length === 0) {
      cards = (<div class="card"><div class="card-body">
                <h5>Add a Show:</h5>
                <a href="#" class="btn btn-primary">New Show</a>
              </div></div>)
    } else {
      cards = this.props.shows.map(function (id) {
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
        {this.state.showsList}
      </div>
    )
  }
}
