'use strict'
import React, { Component } from 'react'
import ButtonGroup from 'canopy-react-buttongroup'
import PropTypes from 'prop-types'

export default class SlidesView extends Component {
  constructor(props) {
    super(props)
    // **Note about this class**
    // I'm going to have to fix the state so it inhertis from the class above,
    // When one tries to create a new slide from an external source
    // the SlidesView nav doesn't handle the update.
    // this issue will mostly be fixed by pulling the stuff from addNewSlide here,
    // and moving it into Edit.jsx
    this.state = {
      buttons: [
        {
          value: 1,
          label: <span>Slide 1</span>
      },
      {
        value: 0,
        label: <span><i className="fas fa-plus-circle"></i>&nbsp; New Slide</span>
      }
      ],
      currentSlide: this.props.currentSlide
    }
    this.handle = this.handle.bind(this)
    this.addNewSlide = this.addNewSlide.bind(this)
  }

  handle(val) {
    if (val == 0)
    {
      //console.log("Event 1: " + val + " Current Slide: " + this.state.currentSlide);
      this.addNewSlide()
      this.props.setCurrentSlide(this.state.currentSlide + 1)
    }
    else if (val == 1)
    {
      //console.log("Event 2: " + val);
      this.props.setCurrentSlide(val)
    }
    else
    {
      //console.log("Event 3:" + val);
      // Pulls the number from the slide object.
      let numericalVal = val.slideNum
      this.props.setCurrentSlide(numericalVal)
    }
  }


  addNewSlide() {
    const curr = this.state.currentSlide
    const slideNum = this.state.currentSlide + 1
    const newItem = {
      value: {slideNum},
      label: <span>Slide {slideNum}</span>
    }

    const copy = [...this.state.buttons]
    copy.splice(curr, 0, newItem)

    for (let i = curr; copy[i]['value'] != 0; i++) {
       const t = i + 1;
       copy[i]['value']['slideNum'] = t;
       copy[i]['label'] = "Slide " + t;
    }

    this.setState(prevState => ({
      buttons: copy,
      currentSlide: this.state.currentSlide + 1
    }))
    this.props.addNewSlide()
  }



  render() {

    const newSlide = [
      {
        value: '0',
        label: <span><i className="fas fa-plus-circle"></i>&nbsp; New Slide</span>
      }
    ]

    return (
      <div className="col-3">
        <p></p>
        <ButtonGroup
          name="slides"
          buttons={this.state.buttons}
          match={0}
          handle={this.handle}
          vertical={true}
          activeColor={'primary'} />
      </div>
    )
  }

}

SlidesView.propTypes = {
  currentSlide: PropTypes.number,
  setCurrentSlide: PropTypes.func
}
