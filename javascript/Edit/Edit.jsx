'use strict'
import React, { Component } from 'react'
import EditView from './EditView.jsx'
import NavBar from './NavBar.jsx'
import SlidesView from './SlidesView.jsx'

export default class Edit extends Component {
  constructor() {
    super()

    this.state = {
      currentSlide: 1,
      // data that represents the slideshow:
      content: [
        {
          title: "Slide 0",
          body: "This will never be seen"
        },
        {
          title: "Slide 1",
          body: "This is will be html(most likely) that will be loaded by the editorState in EditView.jsx"
        }
      ]
    }

    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.setCurrentSlide = this.setCurrentSlide.bind(this)
    this.addNewSlide = this.addNewSlide.bind(this)
    this.deleteCurrentSlide = this.deleteCurrentSlide.bind(this)
    this.renameCurrentSlide = this.renameCurrentSlide.bind(this)
  }

  save() {
    // Do something with content where we can save it as json to the db
  }

  load() {
    // This will retrieve content and load it into the state.
  }

  setCurrentSlide(val) {
    //console.log(val)
    this.setState({
      currentSlide: val
    })
  }

  addNewSlide() {
    // This function adds to the stack of slides held within state.content
    const index = this.state.currentSlide + 1
    const newSlide = {
        title: "New Slide",
        body: "Empty"
    }
    let copy = [...this.state.content]
    //copy.splice(this.state.currentSlide, 0, newSlide)
    copy.push(newSlide)
    this.setState({
      content: copy,
      currentSlide: index
    })
  }

  deleteCurrentSlide() {
    alert("This is not yet implemented.")
  }

  renameCurrentSlide(value) {
    // This doesn't work yet
    let copy = [...this.state.content]
    copy[this.state.currentSlide]['title'] = value
    this.setState({
      content: copy
    })
  }

  render() {
    return (
      <div>
        <NavBar
          save={this.save}
          insertSlide={this.addNewSlide}
          deleteSlide={this.deleteCurrentSlide}
          renameSlide={this.renameCurrentSlide}/>
        <div className="row">
          <SlidesView
            currentSlide={this.state.currentSlide}
            setCurrentSlide={this.setCurrentSlide}
            addNewSlide={this.addNewSlide}/>
          <EditView
            currentSlide={this.state.currentSlide}
            content={this.state.content[this.state.currentSlide]}/>
        </div>
      </div>
    )
  }
}
