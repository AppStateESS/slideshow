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
          saveContent: undefined,
          quizContent: undefined,
          isQuiz: false,
          id: 0 // This is an indexable id for saving and delteing slides
        },
      ],
    }


    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.setCurrentSlide = this.setCurrentSlide.bind(this)
    this.addNewSlide = this.addNewSlide.bind(this)
    this.addNewQuiz = this.addNewQuiz.bind(this)
    this.deleteCurrentSlide = this.deleteCurrentSlide.bind(this)
    this.renameCurrentSlide = this.renameCurrentSlide.bind(this)
    this.saveContentState = this.saveContentState.bind(this)
    this.saveQuizContent = this.saveQuizContent.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  save() {
    let c = this.state.content[this.state.currentSlide].isQuiz ?
          /* if quiz */ this.state.content[this.state.currentSlide].quizContent :
          /* else    */ this.state.content[this.state.currentSlide].saveContent
    $.ajax({
      url: './slideshow/Slide/' + window.sessionStorage.getItem('id'),
      data: {
        content: c,
        index: this.state.content[this.state.currentSlide].id,
        isQuiz: this.state.content[this.state.currentSlide].isQuiz
      },
      type: 'put',
      dataType: 'json',
      error: (req, err) => {
        alert("Failed to save show " + window.sessionStorage.getItem('id'))
        document.write(req.responseJSON.backtrace[0].args[1].xdebug_message)
        console.error(req, err.toString());
      }
    })
  }


  load() {
    $.ajax({
      url: './slideshow/Slide/edit/?id=' + window.sessionStorage.getItem('id'),
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        let loaded = data['slides']
        if (loaded[0] != undefined) {
          let showContent = []
          for (let i = 0; i < loaded.length; i++) {
            let saveC = undefined
            let quizC = undefined
            let isQ = this.quizConv(loaded[i].isQuiz)
            if (!isQ) {
              saveC = loaded[i].content
            } else {
              quizC = loaded[i].content
            }
            showContent.push({
              isQuiz: isQ,
              saveContent: saveC,
              quizContent: quizC,
              id: loaded[i].slideIndex // This may not be needed
            })
          }

          this.setState({
            content: showContent,
            id: loaded[0].showId
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
    this.save()
    this.setState({
      currentSlide: val
    })
  }


  addNewSlide(quiz) {
    if (typeof(quiz) === 'object') quiz = false // an event is bindinded on some calls which causes errors
    /* This function adds to the stack of slides held within state.content */
    const index = this.state.currentSlide + 1
    const newId = Number(this.state.content[this.state.currentSlide].id) + 1
    const newSlide = {
        saveContent: undefined,
        quizContent: undefined,
        isQuiz: quiz,
        id: newId
    }
    let copy = [...this.state.content]
    copy.splice(index, 0, newSlide)
    this.setState({
      currentSlide: index,
      content: copy,
    })
  }


  addNewQuiz() {
    // This method is useless, since we can change this at the call. However, previous code implemented this method seperately
    // and we can simplify this at a later time.
    this.addNewSlide(true)
  }

  deleteCurrentSlide() {
    let copy = [...this.state.content]
    let newIndex = this.state.currentSlide
    // splice one slide at the current index
    copy.splice(this.state.currentSlide, 1)
    // Current slide is the first slide and there are no other slides
    if (this.state.currentSlide === 0 && this.state.content.length == 1) {
      // set the array to an empty slide
      copy = [{saveContent: undefined}]
    }
    // If we are deleting the last slide
    if (this.state.currentSlide == copy.length) {
      newIndex = this.state.currentSlide - 1
    }

    $.ajax({
      url: './slideshow/Slide/' + window.sessionStorage.getItem('id'),
      type: 'patch',
      data: {index: this.state.content[this.state.currentSlide].id},
      error: (req, res) => {
        console.error(req, res.toString());
      }
    })

    this.setState({
      content: copy,
      currentSlide: newIndex
    })
  }

  renameCurrentSlide(value) {
    alert("This has not yet been implemented")
  }

  saveContentState(saveContent) {
    if (saveContent != undefined) {
      let c = [...this.state.content]
      c[this.state.currentSlide].saveContent = saveContent
      this.setState({content: c})
    }
  }

  saveQuizContent(quizContent) {
    let c = [...this.state.content]
    c[this.state.currentSlide].quizContent = quizContent
    this.setState({content: c})
  }

  quizConv(quizT) {
    // When we load from the data base the isQuiz boolean
    // is loaded in as a string or a number
    // We need to handle that and bring it back to a boolean
    if (quizT == undefined) return false // initial load
    if (typeof(quizT) === 'number') return (quizT != 0)
    return (typeof(quizT) === "boolean") ? quizT : JSON.parse(quizT)
  }


  render() {
    let isQuiz = this.quizConv(this.state.content[this.state.currentSlide].isQuiz)
    return (
      <div>
        <NavBar
          save={this.save}
          id={this.state.id}
          insertSlide       ={this.addNewSlide}
          deleteSlide       ={this.deleteCurrentSlide}
          renameSlide       ={this.renameCurrentSlide}
          addToStack        ={this.addToStack}
          currentSlide      ={this.state.currentSlide}
          insertQuiz        ={this.addNewQuiz}
          saveDB            ={this.save} />
        <div className="row">
          <SlidesView
            slides          ={this.state.content}
            currentSlide    ={this.state.currentSlide}
            setCurrentSlide ={this.setCurrentSlide}
            addNewSlide     ={this.addNewSlide}/>
          <EditView
            currentSlide    ={this.state.currentSlide}
            content         ={this.state.content[this.state.currentSlide]}
            isQuiz          ={isQuiz}
            deleteElement   ={this.deleteFromStack}
            saveContentState={this.saveContentState}
            saveQuizContent ={this.saveQuizContent}
            saveDB          ={this.save}
            />
        </div>
      </div>
    )
  }
}
