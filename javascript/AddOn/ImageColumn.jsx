'use strict'
import React, { Component } from 'react'

export default class ImageColumn extends Component {
  constructor(props) {
    super(props)

    this.focus = {
      //border: '3px solid green',
      height: props.height,
      width: props.width,
      objectFit: 'scale-down',  
    }
    
    this.unfocus = {
      //padding: '3px',
      height: props.height,
      width: props.width,
      objectFit: 'scale-down',
    }



    this.state = {
      style: this.unfocus,
      settingsShow: false
    }

    this.alterStyle = this.alterStyle.bind(this)
  }

  alterStyle() {
    if (this.state.style == this.focus) {
      this.setState({style: this.unfocus, settingsShow: !this.state.settingsShow})
    }
    else {
      this.setState({style: this.focus, settingsShow: !this.state.settingsShow})
    }
  }
  
  render() {

    let imageSettings = (
        <div className="card" style={popover}>
          <div className="card-header">
            Image Settings
            
            <a className="close card-text" aria-label="Close" onClick={() => this.setState({settingsShow: false})}>
              <span aria-hidden="true">&times;</span>
            </a>
          </div>
        <div className="card-body" onClick={() => this.setState({settingsShow: false})}>
          <button className="btn btn-danger btn-block" onClick={this.props.remove}>Remove Image</button>
          <button className="btn btn-info btn-block" onClick={this.props.align}>Align {(this.props.mediaAlign === 'right') ? 'Left' : 'Right'}</button>
        </div>
        </div>
      
    )

    return (
      <div className="col">
        {(this.state.settingsShow) ? imageSettings : undefined}
        <span onClick={this.alterStyle}>
           <img src={this.props.src} alt={this.props.src} style={this.state.style} ></img>
        </span>
        
      </div>
    )
  }
}

const popover = {
  position: 'fixed',
  zIndex: 1,
  minWidth: 250,
  boxShadow: '5px 10px 8px black',
  borderRadius: '3px'
}
