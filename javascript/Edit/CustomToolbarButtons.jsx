'use strict'
import React, { Component } from 'react'
import './buttonStyle.css'

import { EditorState, AtomicBlckUtils} from 'draft-js'

export default class CustomToolbarButtons extends Component {
  constructor(props) {
    super(props)
  }

  insertImage() {
    console.log(this.props)
    alert("Insert Image:\n\nnot yet implemented")
  }

  render() {
    return (
      <span>
        <button className="toolbar" onClick={this.insertImage.bind(this)}><i className="fas fa-images"></i></button>
      </span>
    )
  }
}
