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
      id: -1,
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
    this.saveContentState = this.saveContentState.bind(this)
  }

  componentDidMount() {
    this.load();
  }


  save() {
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
    $.ajax({
      url: './slideshow/Show/edit/?id=' + window.sessionStorage.getItem('id'),
      type: 'GET',
      dataType: 'json',
      success: function (data) {

        let loaded = data['slides']

        if (loaded[this.state.currentSlide] != undefined) {
          this.setState({
            content: loaded,
            id: data['id']
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
    copy.splice(index, 0, newSlide)
    this.setState({
      content: copy,
      currentSlide: index
    })
  }


  deleteCurrentSlide(slideNum) {
    // If we try to delete the content from the first slide
    // and there are no slides after.
    if (slideNum === 0 && this.state.content.length == 1) {
      this.setState({
        content: [
          {
            stack: []
          }
        ]
      })
    } else {
      // Clear out stack before deleting it. Other ways caused a lot of issues.
      let copy = [...this.state.content]
      copy[slideNum].stack = []
      this.setState({
        content: copy
      }, () => {
        copy.splice(slideNum, 1)
        let slideIndex = (slideNum === copy.length) ? copy.length - 1 : slideNum
        this.setState({
          content: copy,
          currentSlide: slideIndex
        })
        // Save to database
        this.save()
      })
    }
  }


  renameCurrentSlide(value) {
    alert("This has not yet been implemented")
  }


  addToStack(event) {
    let tempStack = this.state.content[this.state.currentSlide].stack

    let insertType

    switch(event.target.value){
      case 'Title':
        insertType = {type: event.target.value, id: tempStack.length , saveContent: undefined}
        break;
      case 'Textbox':
        insertType = {type: event.target.value, id: tempStack.length , saveContent: undefined}
        break;
      case 'Image':
        insertType = {type: event.target.value, id: tempStack.length , saveContent: undefined}
        break;
      case 'Quiz':
        insertType = {type: event.target.value, id: tempStack.length , saveContent: undefined}
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
          id={this.state.id}
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
            deleteElement={this.deleteFromStack}
            saveContentState={this.saveContentState}/>
        </div>
      </div>
    )
  }
}
