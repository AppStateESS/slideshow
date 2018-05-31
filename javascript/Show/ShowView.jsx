'use strict'
import React, {Component} from 'react'
import ShowList from './ShowList.jsx'

export default class ShowView extends Component {
  constructor() {
      super()
      this.state = {}

    }


  render() {
    return (
      <div>
        <h2>Shows:</h2>
        // TODO: ALl the current shows that are associtaed with the admin user
        // will be rendered here somehow... maybe json of slides
        <ShowList />
      </div>
    )
  }
}
