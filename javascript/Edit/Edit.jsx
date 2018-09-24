'use strict'
import React, { Component } from 'react'
import EditView from './EditView.jsx'
import NavBar from './NavBar.jsx'
import SlidesView from './SlidesView.jsx'
import Show from '../Resources/Show.js'

export default class Edit extends Component {
  constructor() {
    super()

    this.state = {
      id: 1,
      currentSlide: 1,
      // data that represents the slideshow:
      resource: Show,
      content: [
        {
          stack: ['test'],
          title: "Slide Title",
          body: "This will never be seen",
          textBoxContent: null
        },
        {
          stack: [],

          //title: "Slide 1",
          //body: "This is will be html(most likely) that will be loaded by the editorState in EditView.jsx",
          //textBoxContent: undefined
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
    // Do something with content where we can save it as json to the db
    console.log("--- Saving ---")
    let copy = [...this.state.content]
    // Save/update a new js resource
    let r = this.state.resource
    r.content = copy
    this.setState({
      content: copy,
      resource: r
    })
    console.log("*** Contetnt saved locally ***")
    $.ajax({
      url: './slideshow/Show/' + this.state.id,
      data: {content: this.state.content, resource: this.state.resource},
      type: 'put',
      dataType: 'json',
      success: function() {
        console.log("*** Contetnt saved remotely ***")
        this.load();
      }.bind(this),
      error: function(req, err) {
        alert("Failed to save.")
        console.error(req, err.toString());
      }.bind(this)
    });
  }

  load() {
    // This will retrieve content and load it into the state through ajax/REST.
    $.ajax({
      url: './slideshow/Show/edit',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        let loaded = JSON.parse(data['slides'])
        console.log("loaded:");
        console.log(loaded);
        console.log("current state:");
        console.log(this.state.content);
        if (loaded[this.state.currentSlide] != undefined) {
          this.setState({
            content: loaded,
            id: data['id']
          });
        }

      }.bind(this),
      error: function(req, err) {

                //alert("Failed to grab data.")
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
        insertType = {type: event.target.value, id: tempStack.length + 1, body: "Please click me to enter a TITLE.", saveContent: null}
        break;
      case 'Textbox':
        insertType = {type: event.target.value, id: tempStack.length + 1, body: "Please click me to enter BODY TEXT.", saveContent: null}
        break;
      case 'Image':
        insertType = {type: event.target.value, id: tempStack.length + 1, body: "PLACEHOLDER FOR AN IMAGE", saveContent: null}
        break;
      case 'Quiz':
        insertType = {type: event.target.value, id: tempStack.length + 1, body: "PLACEHOLDER FOR A QUIZ", saveContent: null}
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

  saveContentState(saveContent) {
    console.log("current stack:");
    console.log(this.state.content[this.state.currentSlide].stack[0].saveContent)
    console.log("saveContent passed:");
    console.log(saveContent)
    this.state.content[this.state.currentSlide].stack[0].saveContent = saveContent
    //this.state.content[this.state.currentSlide].stack.saveContent = saveContent
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
            currentSlide={this.state.currentSlide}
            setCurrentSlide={this.setCurrentSlide}
            addNewSlide={this.addNewSlide}/>
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
