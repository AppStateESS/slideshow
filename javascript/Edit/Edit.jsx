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

  componentDidMount() {
    this.load();
  }

  save() {
    let copy = [...this.state.content]
    this.setState({
      content: copy
    })

    $.ajax({
      url: './slideshow/Show/' + window.sessionStorage.getItem('id'),
      data: {content: this.state.content},
      type: 'put',
      dataType: 'json',
      success: function() {
        this.load();
      }.bind(this),
      error: function(req, err) {
        alert("Failed to save show " + window.sessionStorage.getItem('id'))
        console.error(req, err.toString());
      }.bind(this)
    });
  }

  load() {
    // This will retrieve content and load it into the state through ajax/REST.
    $.ajax({
      url: './slideshow/Show/edit/?id=' + window.sessionStorage.getItem('id'),
      type: 'GET',
      dataType: 'json',
      success: function (data) {

        let loaded = data['slides']

        if (loaded[this.state.currentSlide] != undefined) {
          this.setState({
            content: loaded
          });
        }
      }.bind(this),
      error: function(req, err) {
        alert("Failed to load data.")
        console.error(req, err.toString());
      }.bind(this)
    });
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
    // There always has to be one slide, this will reset the
    // stack to ensure there is always one slide per slideshow
    if (slideNum === 0 && this.state.content.length == 1) {
      let copy = [...this.state.content]
      copy[0]['stack'] = []
      this.setState({content: copy})
    } else {
      let tempContent = this.state.content
      tempContent.splice(slideNum, 1)
      // If the first slide needs to be deleted but the slideshow
      // already has multiple slides, we can safely delete the first slide.
      let cslide = (slideNum == 0) ? 0 : slideNum - 1
      this.setState({
        content: tempContent,
        currentSlide: cslide
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
        insertType = {type: event.target.value, id: tempStack.length + 1, saveContent: undefined}
        break;
      case 'Textbox':
        insertType = {type: event.target.value, id: tempStack.length + 1, saveContent: undefined}
        break;
      case 'Image':
        insertType = {type: event.target.value, id: tempStack.length + 1, saveContent: undefined}
        break;
      case 'Quiz':
        insertType = {type: event.target.value, id: tempStack.length + 1, saveContent: undefined}
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

  saveContentState(saveContent, stackNum) {
    // Updates the saveContent variable within the slideshow stack.
    this.state.content[this.state.currentSlide].stack[stackNum].saveContent = saveContent
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
            deleteElement={this.deleteFromStack}
            saveContentState={this.saveContentState.bind(this)}/>
        </div>
      </div>
    )
  }
}
