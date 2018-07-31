import React, {Component} from 'react'
import ShowCard from './ShowCard.jsx'

export default class ShowList extends Component {
  constructor() {
    super()
    this.state = {
    }
    this.showList = this.showList.bind(this)
  }

  showList() {

  }

  render() {
    console.log(this.props.data);
    

    return (
      <div>
        {cards}
      </div>
    )
  }
}
