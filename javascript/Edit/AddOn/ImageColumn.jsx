'use strict'
import React, { Component } from 'react'
import Tippy from '@tippy.js/react'
import 'tippy.js/themes/light-border.css'

export default class ImageColumn extends Component {
  render() {

    const left = (<span key="left"><i className="fas fa-arrow-left"></i> Align Left</span>)
    const right = (<span key="right">Align Right <i className="fas fa-arrow-right"></i></span>)

    const settingsButtons = (
      <div style={{width: 200}}>
        <button className="btn btn-danger btn-block" onClick={this.props.remove}>Remove Image <i className="fas fa-trash"></i></button>
        <button className="btn btn-primary btn-block" onClick={(event) => this.props.align(this.props.mediaAlign === 'right' ? 'left' : 'right')}>
          {(this.props.mediaAlign === 'right') ? left : right}
        </button>
      </div>
    )

    const imgStyle= {
      height: this.props.height,
      width: this.props.width,
      bjectFit: 'scale-down',
    }

    return (
      <div className="col">
        <Tippy content={settingsButtons} interactive={true} arrow={true} theme="light-border">
           <img src={this.props.src} alt={this.props.src} style={imgStyle} ></img>
        </Tippy>
      </div>
    )
  }
}

