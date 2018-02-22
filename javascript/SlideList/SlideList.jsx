'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Waiting from '../AddOn/Html/Waiting'
import NewSlide from './NewSlide'


/* global $ */

export default class SlideList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listing: null,
      show: null,
    }
    this.createSlide = this.createSlide.bind(this)
    this.load = this.load.bind(this)
  }

  componentDidMount() {
    this.load()
  }
  
  createSlide() {
    $.ajax({
      url: './slideshow/Slide/',
      data: {showId : this.props.showId},
      dataType: 'json',
      type: 'post',
      success: function(data) {
        const slideId = data.slideId
        window.location.href = `./slideshow/Slide/${slideId}/edit`
      }.bind(this),
      error: function(){}.bind(this)
    })
  }
  

  load() {
    $.ajax({
      url: 'slideshow/Slide/list/' + this.props.showId,
      dataType: 'json',
      type: 'get',
      success: function (data) {
        this.setState({listing: data.listing, show: data.show})
      }.bind(this),
      error: function () {}.bind(this)
    })
  }

  render() {
    if (this.state.listing === null) {
      return <Waiting/>
    }
    let slideList = this.state.listing.map(function(value, key){
      return (
        <div key={key} onClick={() => window.location.href= `slideshow/Slide/${value.id}/edit`}>slide {value.id}</div>
      )
    }.bind(this))
    
    return (<div>{slideList}<NewSlide handleClick={this.createSlide} /></div>)
  }
}

SlideList.propTypes = {
  showId: PropTypes.string
}

SlideList.defaultProps = {}
