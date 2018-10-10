'use strict'
import React, { Component } from 'react'
import EditView from './EditView.jsx'
import NavBar from './NavBar.jsx'
import SlidesView from './SlidesView.jsx'

export default class Edit extends Component {
  constructor() {
    super()

    this.state = {
      currentSlide: 0,
      // data that represents the slideshow:
      content: [
        {
          stack: []
        }
      ]
    }

    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.setCurrentSlide = this.setCurrentSlide.bind(this)
    this.addNewSlide = this.addNewSlide.bind(this)
    this.deleteCurrentSlide = this.deleteCurrentSlide.bind(this)
    this.renameCurrentSlide = this.renameCurrentSlide.bind(this)
    this.addToStack = this.addToStack.bind(this)
    this.deleteFromStack = this.deleteFromStack.bind(this)
  }

  save(contentState) {
    // Do something with content where we can save it as json to the db
    //console.log("--- Saving ---")
    let copy = [...this.state.content]
    copy[this.state.currentSlide]['textBoxContent'] = contentState
    this.setState({
      content: copy
    })
    //console.log(this.state.content[this.state.currentSlide]['textBoxContent'])
  }

  load() {
    // This will retrieve content and load it into the state through ajax/REST.
  }

  setCurrentSlide(val) {
    this.setState({
      currentSlide: val
    })
  }

  addNewSlide() {
    // This function adds to the stack of slides held within state.content
    const index = this.state.currentSlide + 1
    const newSlide = {
        stack: []
    }
    let copy = [...this.state.content]
    //copy.splice(this.state.currentSlide, 0, newSlide) -> this will replace below at some point
    copy.push(newSlide)
    this.setState({
      content: copy,
      currentSlide: index
    })
  }

  deleteCurrentSlide(slideNum) {
    console.log(slideNum)

    if (slideNum === 1) {
      let copy = [...this.state.content]
      copy[1]['stack'] = []
      this.setState({content: copy})
      return
    } else {
      console.log("madeit")
      let tempContent = this.state.content

      tempContent.splice(slideNum, 1)
      this.setState({
        content: tempContent,
        currentSlide: slideNum - 1
      })

    }
  }

  renameCurrentSlide(value) {
    // This works but it doesn't update when it should.
    // It's delayed for some reason.(it's bc of the way props/states work for parent-child relationships)
    let copy = [...this.state.content]
    copy[this.state.currentSlide]['title'] = value
    this.setState({
      content: copy
    })
    console.log(copy)
    console.log(this.state.content)
  }

  addToStack(event) {
    let tempStack = this.state.content[this.state.currentSlide].stack
    // If the array length - 1 < 0 then there is nothing so idNum starts at 0
    // Otherwise, go into the array at index - 1 and use that object's id
    let idNum = (tempStack.length - 1 >= 0) ? tempStack[tempStack.length - 1].id : 0
    let insertType

    switch(event.target.value){
      case 'Title':
        insertType = {type: event.target.value, id: idNum + 1, body: "Please click me to enter a TITLE.", saveContent: undefined}
        break;
      case 'Textbox':
        insertType = {type: event.target.value, id: idNum + 1, body: "Please click me to enter BODY TEXT.", saveContent: undefined}
        break;
      case 'Image':
        insertType = {type: event.target.value, id: idNum + 1, body: "PLACEHOLDER FOR AN IMAGE", saveContent: undefined}
        break;
      case 'Quiz':
        insertType = {type: event.target.value, id: idNum + 1, body: "PLACEHOLDER FOR A QUIZ", saveContent: undefined}
        break;
      default:
      //do nothing for now..
    }
    tempStack.push(insertType)

    let copy = [...this.state.content]
    copy[this.state.currentSlide]['stack'] = tempStack
    this.setState({
      content: copy
    })
  }

  deleteFromStack(element) {
    // remove id-1 from array
    let tempStack = this.state.content[this.state.currentSlide].stack
    let index = tempStack.indexOf(element);

    if (index > -1) {
      tempStack.splice(index, 1)
    }

    let copy = [...this.state.content]
    copy[this.state.currentSlide]['stack'] = tempStack
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
          renameSlide={this.renameCurrentSlide}
          addToStack ={this.addToStack}
          currentSlide={this.state.currentSlide}/>
        <div className="row">
          <SlidesView
            slides          ={this.state.content}
            currentSlide    ={this.state.currentSlide}
            setCurrentSlide ={this.setCurrentSlide}
            addNewSlide     ={this.addNewSlide}/>
          <EditView
            currentSlide={this.state.currentSlide}
            content={this.state.content[this.state.currentSlide].stack}
            save={this.save}
            deleteElement={this.deleteFromStack}/>
        </div>
      </div>
    )
  }
}
