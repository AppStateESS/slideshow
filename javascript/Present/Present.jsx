'use strict'
import React, { Component } from 'react'
import PresentView from './PresentView.jsx'

export default class Present extends Component {
  constructor() {
    super()

    this.state = {
      currentSlide: 0,
      highestSlide: 0,
      content: [
        {
          saveContent: undefined,
          quizContent: undefined
        }
      ],
      slideName: "Present: ",
      // Flags:
      prevDisable: true, // Disables prev button
      nextDisable: true, // Disables next button
      nextFlag: false, // true if user just changed slide
      quizNextFlag: false, // the currentSlide is a quiz
      quizPassed: false,
      finishFlag: false // true when user has completed the show
    }
    this.load = this.load.bind(this)
    this.updateSession = this.updateSession.bind(this)

    this.prev = this._prev.bind(this)
    this.next = this._next.bind(this)

    this.validate = this.validate.bind(this)
    this.returnToShowList = this.returnToShowList.bind(this)
    this.parseBool = this.parseBool.bind(this)
  }

  componentDidMount() {
    this.load()
    this.loadSession()
  }

  componentDidUpdate() {
    if (this.state.quizNextFlag && (this.state.quizPassed || this.state.finishFlag)) {
      // Correct answer chosen
      this.setState({
        quizNextFlag: false,
        nextDisable: false,
        quizPassed: false,
      })
    }
    else if (this.state.nextFlag && this.state.content != undefined) {
      // SO this section is a beast -> There is probably a way to structure this better logically.
      // There are a lot of logical components that are changing and so the structure might not be the cleanest
      // However, it works!!! I tried my best to comment an explination for how this works - Tyler

      // slide has changed
      this.updateSession()
      this.setState({nextDisable: true, prevDisable: true})

      let isQuiz = this.parseBool(this.state.content[this.state.currentSlide].isQuiz) // Converts boolean if isQuiz is a string
      //let lastSlide = (this.state.currentSlide + 1 == this.state.content.length) // true if we are on last slide
      if (isQuiz) {
        this.setState({quizNextFlag: true}) // we changed to a quiz slide, handle the rest after user selects answer
      }
      else if (this.state.currentSlide == this.state.highestSlide && !this.state.finishFlag) { // we are on the highest slide and haven't finished the show yet
        setTimeout(() => {
          // Note: when this was declared above, an issue was created where it wasn't being loaded fast enough and it set the last slide to true
          let lastSlide = this.state.currentSlide + 1 == this.state.content.length
          this.setState({nextDisable: false, finishFlag: (this.state.finishFlag || lastSlide)}) // on completion of timer, we unlock next and set finishFlag
        }, 2000)
      }
      else if (this.state.currentSlide < this.state.highestSlide || this.state.finishFlag) { // we are on an already completed slide
        this.setState({nextDisable: false})
      }
      if (this.state.currentSlide > 0) { // we are on the first slide
        this.setState({prevDisable: false})
      }
      if (this.state.currentSlide < this.state.highestSlide) { // we have already completed this slide
        this.setState({nextDisable: false})
      }
      // If we are on the last slide
      if ((this.state.content.length == this.state.currentSlide + 1) && this.state.currentSlide != 0) {
        this.setState({finishFlag: true}, () => this.updateSession())
      }
      this.setState({nextFlag: false}) // we have handled the slide change
    }
  }

  load() {
    $.ajax({
      url: './slideshow/Slide/present/?id=' + window.sessionStorage.getItem('id'),
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        let loaded = data['slides']
        if (loaded != null) {
          let showContent = []
          for (let i = 0; i < loaded.length; i++) {
            let saveC = undefined
            let quizC = undefined
            let isQ = this.parseBool(loaded[i].isQuiz)
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
            slideName: data['title'],
            quizNextFlag: this.parseBool(showContent[0].isQuiz) // First slide is a quiz
          }, () => {
            console.log(this.state.content)
            if (!this.state.quizNextFlag) {
              // First slide isn't a quiz we set timer on next
              setTimeout(() => {
                this.setState({nextDisable: false})
              }, 2000)
            }
          });
        }
      }.bind(this),
      error: function(req, err) {
        alert("Failed to load data.")
        console.error(req, err.toString());
      }.bind(this)
    });
  }

  loadSession() {
    $.ajax({
      url: './slideshow/Session/' + window.sessionStorage.getItem('id'),
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        //console.log(data)
        if (data.highestSlide != null) {
          let high = parseInt(data.highestSlide)
          let curr = parseInt(data.highestSlide)
          const finish = this.parseBool(data.completed)
          if (curr >= this.state.content.length) {
            curr = this.state.content.length - 1
          }
          this.setState({
            highestSlide: high,
            currentSlide: curr,
            finishFlag: finish,
            nextFlag: true,
            quizNextFlag: true,
            quizPassed: true
          }, () => {console.log("session loaded")})
        }
      }.bind(this),
      error: function(req, err) {
        //alert("Failed to load session from db.")
        //console.log("If you are an admin, disregard the error below:")
        console.error(req, err.toString())
      }.bind(this)
    })
  }

  updateSession() {
    /* Updates the db that saves the users location within the slideshow */
    $.ajax({
      url: './slideshow/Session/' + window.sessionStorage.getItem('id'),
      type: 'PUT',
      data: {highestSlide: Number(this.state.highestSlide), completed: this.state.finishFlag},
      dataType: 'json',
      success: function() {
        //console.log("session updated successfully")
      }.bind(this),
      error: function(req, err) {
        //console.log("Failed to updated user's session data:")
        //console.log(this.state.highestSlide)
        console.error(req, err.toString())
        alert(req.responseText)
      }.bind(this)
    })
  }

  changeSlide(slideNum) {
    let highest = this.state.highestSlide
    if (this.state.highestSlide < slideNum) {
      highest = slideNum
    }
    this.setState({
      currentSlide: slideNum,
      highestSlide: highest,
      nextFlag: true
    })
  }

  _prev() {
    if (this.state.currentSlide != 0) {
      this.changeSlide(this.state.currentSlide - 1)
    }
  }

  _next() {
    if (this.state.currentSlide != this.state.content.length - 1) {
      this.changeSlide(this.state.currentSlide + 1)
    }
  }

  validate() {
    /* this function is only called if the correct answer is chosen */

    let finish = this.state.finishFlag
    if (this.state.content.length == this.state.currentSlide + 1) {
      finish = true
    }
    this.setState({quizPassed: true, finishFlag: finish}, () => this.updateSession())
  }

  returnToShowList() {
    window.location.href = './slideshow/Show/list'
  }

  parseBool(bool) {
    if (bool == undefined) return false
    console.log("bool: " + typeof(bool) + " value: " + bool)
    if (typeof(bool) === "string") return (Number(bool) != 0)
    if (typeof(bool) === 'number') return (bool != 0)
    return (typeof(bool) === "boolean") ? bool : JSON.parse(bool)
  }

  render() {
    let inc = 0
    let slidesButtons = this.state.content.map(function(slide) {
      inc += 1
      if (inc - 1 == this.state.currentSlide) {
        return (
          <button key={inc} className="btn btn-primary">{inc}</button>
        )
      }
      else if (inc <= this.state.highestSlide + 1 && inc >  this.state.currentSlide - 7) {
        return (
          <button key={inc} className="btn btn-secondary" onClick={this.changeSlide.bind(this,inc-1)}>{inc}</button>
        )
      }
    }.bind(this));
    /*console.log("curr: " + this.state.currentSlide)
    console.log("len: " + this.state.content.length)
    console.log(this.state.currentSlide + 1 == this.state.content.length)*/
    let nextButton = (this.state.finishFlag) ?
      <button key="finish" className="btn btn-secondary" onClick={this.returnToShowList} disabled={this.state.nextDisable}>Finish</button> :
      <button key="next" className="btn btn-secondary" onClick={this.next} disabled={this.state.nextDisable}>Next</button>

    return(
      <div>
        <h1 style={{textDecorationLine: 'underline'}}>{this.state.slideName}</h1>
        <br></br>
        <div style={{justifyContent: 'center', display: 'flex'}}>
          <div style={{maxWidth: 700, width: "95%"}}>
            <PresentView
              currentSlide={this.state.currentSlide}
              high={this.state.highestSlide}
              content={this.state.content[this.state.currentSlide]}
              nextSlide={this.next}
              validate={this.validate}
              />
          </div>
        </div>
        <div style={{justifyContent: 'center', display: 'flex', marginBottom: '2rem'}}>
          <div className="btn-toolbar">
            <div className="btn-group">
              <button className="btn btn-secondary" onClick={this.prev} disabled={this.state.prevDisable}>Previous</button>
              {slidesButtons}
              {nextButton}
            </div>
          </div>
        </div>
    </div>
    )
  }
}
