'use strict'
import React, { Component } from 'react'
import EditView from './EditView.jsx'
import NavBar from './NavBar.jsx'
import NavCards from './NavCards.jsx'
import {
  Button,
  InputGroup,
  FormControl,
} from 'react-bootstrap'

import domtoimage from '../Resources/dom-to-image'

export default class Edit extends Component {
  constructor() {
    super()

    this.state = {
      currentSlide: 0,
      id: window.sessionStorage.getItem('id'),
      showTitle: 'Edit:',
      editTitleView: false,
      content: [
        {
          saveContent: undefined,
          quizContent: undefined,
          isQuiz: false,
          backgroundColor: '#E5E7E9',
          media: {imgUrl: '', align: ''},
          slideId: 0,
          thumb: undefined
        },
      ],
      slideTimer: 2,
    }


    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.saveDomScreen = this.saveDomScreen.bind(this)
    this.setCurrentSlide = this.setCurrentSlide.bind(this)
    this.addNewSlide = this.addNewSlide.bind(this)
    this.addNewQuiz = this.addNewQuiz.bind(this)
    this.pushNewSlide = this.pushNewSlide.bind(this)
    this.deleteCurrentSlide = this.deleteCurrentSlide.bind(this)
    this.moveSlide = this.moveSlide.bind(this)
    this.saveTitle = this.saveTitle.bind(this)
    this.saveContentState = this.saveContentState.bind(this)
    this.saveQuizContent = this.saveQuizContent.bind(this)
    this.saveMedia = this.saveMedia.bind(this)
    this.removeMedia = this.removeMedia.bind(this)
    this.changeBackground = this.changeBackground.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps, prevState) {
    // This is used for debugging
    if (this.state.currentSlide != prevState.currentSlide) {

    }

  }

  save() {
   this.saveDomScreen() 
    $.ajax({
      url: './slideshow/Slide/' + window.sessionStorage.getItem('id'),
      data: {
        slides: [...this.state.content]
      },
      type: 'put',
      dataType: 'json',
      success: (slideIds) => {
        // Update slideIds
        let c = [...this.state.content]
        slideIds.map((id, i) => {
          c[i].slideId = id
        })
        this.setState({content: c}, () => {
          window.sessionStorage.setItem('slideId', this.state.content[this.state.currentSlide].slideId)
        })
      },
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
          window.sessionStorage.setItem('slideId', loaded[0].id)
          let showContent = []
          for (let i = 0; i < loaded.length; i++) {
            let saveC = undefined
            let quizC = undefined
            let isQ = this.quizConv(loaded[i].isQuiz)
            if (!isQ) {
              saveC = loaded[i].content
            } else {
              if (loaded[i].content != undefined) {
                quizC = JSON.parse(loaded[i].content)
              }
            }
            showContent.push({
              isQuiz: isQ,
              saveContent: saveC,
              quizContent: quizC,
              backgroundColor: loaded[i].backgroundColor,
              thumb: JSON.parse(loaded[i].thumb || '{}'), // Ensure that this isn't undefined
              slideId: Number(loaded[i].id),
              media: JSON.parse(loaded[i].media || '{}')
            })
          }

          this.setState({
            content: showContent,
            id: loaded[0].showId
          });
        }
        else {
          this.save()
        }
      }.bind(this),
      error: function(req, err) {
        alert("Failed to load data.")
        console.error(req, err.toString());
      }.bind(this)
    });

    $.ajax({
      url: './slideshow/Show/present/?id=' + window.sessionStorage.getItem('id'),
      type: 'GET',
      dataType:'json',
      success: (data) => {
        this.setState({
          slideTimer: Number(data[0].slideTimer),
          showTitle: data[0].title,
        })
      },
      error: (request, response) => {
        console.log(request)
        console.error(response)
      }
    });
  }

  saveDomScreen(domNode, index) {
    if (domNode === undefined) {
      domNode = document.getElementById('editor')
      index = domNode.getAttribute('data-key')
    }
    
    if (domNode.getAttribute('data-key') == index) {
      domtoimage.toPng(domNode).then((dataUrl) => {
        let img = new Image()
        img.src = dataUrl
        img.width = 200
        img.height = 100
        let fData = new FormData()
        fData.append('thumb', img.src)
        fData.append('slideId', this.state.content[index].slideId)
        $.post({
          url: './slideshow/Slide/thumb/' + window.sessionStorage.getItem('id'),
          type: 'POST',
          data: fData,
          processData: false,
          contentType: false,
          success: (path) => {
            let c = [...this.state.content]
            c[index].thumb = JSON.parse(path)
            this.setState({content: c})
          },
          error: (req, res) => {
            console.log(req)
            console.error(res)
          }
        })
      }).catch(function (error) {
        console.error(error)
      })
    }
  }


  setCurrentSlide(val) {
    this.setState({currentSlide: val}, () => this.save())
  }


  addNewSlide(quiz) {
    if (typeof(quiz) != 'boolean') quiz = false // an event is bindinded on some calls which causes errors
    /* This function adds to the stack of slides held within state.content */
    const index = this.state.currentSlide + 1
    const newSlide = {
        saveContent: undefined,
        quizContent: undefined,
        isQuiz: quiz,
        backgroundColor: '#E5E7E9',
    }
    let copy = [...this.state.content]
    copy.splice(index, 0, newSlide)
    this.setState({
      //currentSlide: index,
      content: copy,
    }, () => this.setCurrentSlide(index))
  }


  addNewQuiz() {
    // This method is useless, since we can change this at the call. However, previous code implemented this method seperately
    // and we can simplify this at a later time.
    this.addNewSlide(true)
  }

  // addNewSlide to the end
  pushNewSlide() {
    const index = this.state.content.length
    const newSlide = {
        saveContent: undefined,
        quizContent: undefined,
        isQuiz: false,
        backgroundColor: '#E5E7E9',
    }
    let copy = [...this.state.content]
    copy.push(newSlide)
    this.setState({
      //currentSlide: index,
      content: copy,
    }, () => this.setCurrentSlide(index))
  }

  deleteCurrentSlide() {
    let copy = [...this.state.content]
    let newIndex = this.state.currentSlide
    // splice one slide at the current index
    copy.splice(this.state.currentSlide, 1)
    // Current slide is the first slide and there are no other slides
    if (this.state.currentSlide === 0 && this.state.content.length == 1) {
      // set the array to an empty slide
      copy = [{saveContent: undefined, isQuiz: false, backgroundColor: '#E5E7E9'}]
    }
    // If we are deleting the last slide
    if (this.state.currentSlide == copy.length) {
      newIndex = this.state.currentSlide - 1
    }

    $.ajax({
      url: './slideshow/Slide/' + window.sessionStorage.getItem('id'),
      type: 'delete',
      data: {slideId: this.state.content[this.state.currentSlide].slideId, type: 'slide'},
      error: (req, res) => {
        console.error(req, res.toString());
      }
    })

    this.setState({
      content: copy,
      currentSlide: newIndex
    }, /*() => this.setCurrentSlide(newIndex)*/)
  }

  moveSlide(fromIndex, toIndex) {
    let c = [...this.state.content]
    let slide = c[fromIndex]
    c.splice(fromIndex, 1)
    c.splice(toIndex, 0, slide)
    this.setState({content: c})
  }

  saveTitle() {
    $.ajax({
      url: './slideshow/Show/' + window.sessionStorage.getItem('id'),
      data: {title: this.state.showTitle},
      type: 'put',
      dataType: 'json',
      success: function() {
        this.setState({editTitleView: false})
      }.bind(this),
      error: function(req, err) {
        alert("Failed to save data.")
        console.error(req, err.toString());
      }.bind(this)
    });
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

  saveMedia(imgUrl, align) {
    let c = [...this.state.content]
    c[this.state.currentSlide].media = {imgUrl: imgUrl, align: align}
    this.setState({content: c}, () => this.save())
  }


  removeMedia() {
    $.ajax({
      url: './slideshow/Slide/' + window.sessionStorage.getItem('id'),
      method: 'delete',
      data: {type: 'image', slideId: this.state.content[this.state.currentSlide].slideId},
      error: (req, res) => {
        console.log(res.toString())
      }
    })
    let c = [...this.state.content]
    c[this.state.currentSlide].media = ""
    this.setState({content: c})
  }

  quizConv(quizT) {
    // When we load from the data base the isQuiz boolean
    // is loaded in as a string or a number
    // We need to handle that and bring it back to a boolean
    if (quizT == undefined) return false // initial load
    if (typeof(JSON.parse(quizT)) === 'number') return (JSON.parse(quizT) != 0)
    return (typeof(JSON.parse(quizT)) === "boolean") ? quizT : JSON.parse(quizT)
  }

  changeBackground(newColor) {
    let c = [...this.state.content]
    c[this.state.currentSlide].backgroundColor = newColor
    this.setState({content: c}, () => this.save())
  }


  render() {
    let isQuiz = this.quizConv(this.state.content[this.state.currentSlide].isQuiz)
    let cardTitle;
    if (this.state.editTitleView) {
      cardTitle = <InputGroup>
                    <FormControl
                      style={{maxWidth: 350}}
                      value={this.state.showTitle}
                      onChange={(event) => this.setState({showTitle: event.target.value})}
                      onKeyDown={(event) => {if (event.key === 'Enter') this.saveTitle()}}
                    />
                    <InputGroup.Append>
                      <Button variant="primary" onClick={this.saveTitle}>Save</Button>
                    </InputGroup.Append>
                  </InputGroup>
    } else {
      cardTitle = <div>
                    <u>
                    {this.state.showTitle}
                    </u>
                    <a onClick={() => this.setState({editTitleView: true})} style={{paddingLeft: "10px", cursor: "pointer"}}>
                      <i className="fas fa-edit fa-sm"></i>
                    </a>
                  </div>
    }

    return (
      <div>
      <h2>{cardTitle}</h2>
        <NavBar
          id                ={Number(this.state.id)}
          insertSlide       ={this.addNewSlide}
          deleteSlide       ={this.deleteCurrentSlide}
          renameSlide       ={this.renameCurrentSlide}
          addToStack        ={this.addToStack}
          currentSlide      ={this.state.currentSlide}
          insertQuiz        ={this.addNewQuiz}
          saveDB            ={this.save}
          changeBackground  ={this.changeBackground}
          currentColor      ={this.state.content[this.state.currentSlide].backgroundColor}
          slideTimer        ={this.state.slideTimer}
          />
        <div className="row">
          <NavCards 
            content         ={this.state.content}
            setCurrentSlide ={this.setCurrentSlide}
            addNewSlide     ={this.pushNewSlide}
            currentSlide    ={this.state.currentSlide}
            moveSlide       ={this.moveSlide}
            saveDomScreen   ={this.saveDomScreen}
          />
          <EditView
            currentSlide    ={this.state.currentSlide}
            content         ={this.state.content[this.state.currentSlide]}
            isQuiz          ={isQuiz}
            deleteElement   ={this.deleteFromStack}
            saveContentState={this.saveContentState}
            saveQuizContent ={this.saveQuizContent}
            saveMedia       ={this.saveMedia}
            removeMedia     ={this.removeMedia}
            saveDB          ={this.save}
            load            ={this.load}
            />
        </div>
      </div>
    )
  }
}
