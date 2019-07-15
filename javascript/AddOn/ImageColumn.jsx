'use strict'
import React, { Component } from 'react'

import {
  OverlayTrigger,
  Popover
} from 'react-bootstrap'
import { inherits } from 'util';

export default class ImageColumn extends Component {
  constructor(props) {
    super(props)

    this.focus = {
      //border: '3px solid green',
      height: this.props.height,
      width: this.props.width,
      objectFit: 'scale-down',  
    }
    
    
    this.unfocus = {
      //padding: '3px',
      height: this.props.height,
      width: this.props.width,
      objectFit: 'scale-down',
    }

    this.state = {
      style: this.unfocus
    }
    
    this.alterStyle = this.alterStyle.bind(this)
  }

  alterStyle() {
    if (this.state.style == this.focus) {
      this.setState({style: this.unfocus})
    }
    else {
      this.setState({style: this.focus})
    }
  }
    
  render() {


    let imageSettings = (
      <Popover title="Image settings" id="settings" style={{textAlign: 'center', width: 400}}>
        <div>
          <button className="btn btn-danger btn-block" onClick={this.props.remove}>Remove Image</button>
          <button className="btn btn-info btn-block">Adjust Dimensions</button>
        </div>
      </Popover>
    )

    return (
      <div className="col">
        
        <span onClick={this.alterStyle}>
        <OverlayTrigger trigger="click" placement="top" overlay={imageSettings}>
           <img src={this.props.src} alt={this.props.src} style={this.state.style}></img>
        </OverlayTrigger>
        </span>
        
      </div>
    )
  }
}

