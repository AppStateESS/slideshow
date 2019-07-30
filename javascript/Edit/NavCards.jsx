'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './'

export default class NavCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSlide: this.props.currentSlide,
      dragItem: -1,
      dragLineIndex: -1,
      addSlideHover: false
    }
    this.handleSlide = this.handleSlide.bind(this)
    this.handleNewSlide = this.handleNewSlide.bind(this)
  }

  componentDidMount() {
    document.addEventListener('dragenter', (event) => {
      if (event.target.className === 'thumb' && Number(event.target.id) >= 0) {
        this.setState({dragLineIndex: Number(event.target.id)})
      }
    })

    document.addEventListener('dragstart', (event) => {
      let img = event.target.cloneNode(true)
      // TODO: insert custom image or logo
      // right now i pass the slide and make it render off screen
      event.dataTransfer.setDragImage(img, -5000, 100)
      this.setState({dragLineIndex: this.props.currentSlide, dragItem: event.target.id})
    }, false)

    document.addEventListener('dragend', (event) => {
      //event.target.style.display = "initial"
      this.props.moveSlide(this.state.dragItem, this.state.dragLineIndex)
      this.props.setCurrentSlide(this.state.dragLineIndex)
      this.setState({dragLineIndex: -1})
    })
  }

  componentWillUnmount() {
    document.removeEventListener('dragenter')
    document.removeEventListener('dragstart')
    document.removeEventListener('dragend')
  }

  handleSlide(event) {
    this.props.setCurrentSlide(event.target.value - 1)
  }

  handleNewSlide() {
    this.props.addNewSlide()
  }

  render() {

    let data = this.props.content.map((slide, i) => {
      let key = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)) //#1E90FF
      let highlight = (this.props.currentSlide == i) ? ({border: 'solid 3px #007bff', borderRadius: 3, zIndex: -1}) : {padding: '3px'}
      let top = (this.state.dragItem >= this.state.dragLineIndex)
      let bar = (this.state.dragLineIndex != -1 && i == this.state.dragLineIndex) ? {border: 'solid 1px #1E90FF'} : {border: 'solid 1px white'}
      return (
        <span key={i}>
          {top ? <div key={`a-${i}`} style={bar}></div> : undefined}
          <div id="card" style={cardStyle} onClick={() => this.props.setCurrentSlide(i)} key={i}>
            <img id={i} className="thumb" key={i} src={slide.thumb} width={175} height={100} alt={"loading..."} style={highlight} draggable={true}></img> 
          </div>
          {!top ? <div key={`b-${i}`} style={bar}></div> : undefined}
        </span>
      )
    })

    return (
      <div id="container" className="col" style={containerStyle} onMouseEnter={() => this.props.saveDomScreen()}>
        {data}
        <div id={this.props.content.length - 1} className="card" 
          style={this.state.addSlideHover ? addSlideHover : addSlideStyle} 
          onClick={this.handleNewSlide} onMouseEnter={() => this.setState({addSlideHover: true})} onMouseLeave={() => this.setState({addSlideHover: false})}>
          Add New Slide
          <br></br>
          <i className="fas fa-plus-circle" style={{color: '#007bff',float: 'right', marginLeft: '44%'}}></i>
        </div>
      </div>
    )
  }

}

const cardStyle = {
  width: 175, height: 100, marginBottom: 5, marginTop: 5 
}

const addSlideStyle = {
  border: 'dashed 1px ', width: 175, height: 100, textAlign: 'center', justifyContent: 'center', color: '#007bff', marginBottom: 20, marginTop: 10
}

const addSlideHover = {
  border: 'solid 3px', color: '007bff', width: 175, height: 100, textAlign: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 10
}

const containerStyle = {
  overflowY: 'scroll', height: 600, maxWidth: 210, marginTop: 75, scrollbarWidth: 'thin', marginBottom: 10
}

NavCards.propTypes = {
  slides: PropTypes.array,
  currentSlide: PropTypes.number,
  setCurrentSlide: PropTypes.func,
  addNewSlide: PropTypes.func,
  moveSlide: PropTypes.func
}
