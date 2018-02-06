'use strict'
import React from 'react'
import Abstract from '../AddOn/Mixin/Abstract.jsx'
import SlideObj from '../Resources/Slide.js'
import InputField from '../AddOn/Form/InputField.jsx'
import Dropzone from 'react-dropzone'
import ReactSummernote from 'react-summernote'
import Modal from '../AddOn/Html/Modal.jsx'
import Decision from './Decision.jsx'
import DecisionForm from './DecisionForm'
import { options } from '../Config/Summernote.js'
import 'react-summernote/dist/react-summernote.css'
import './style.css'
import 'bootstrap/js/modal'
import 'bootstrap/js/tooltip'
import 'bootstrap/dist/css/bootstrap.css'

/* global $, slideId */

export default class Slide extends Abstract {
  constructor() {
    super()
    this.resourceName = 'Slide'
    this.state = {
      resource: new SlideObj(slideId),
      showForm: false,
      currentForm: 'content',
      choiceText: '',
      currentDecisionKey: null,
      currentDecision: null,
    }
    this.getForm = this.getForm.bind(this)
    this.dropzone = this.dropzone.bind(this)
    this.hideForm = this.hideForm.bind(this)
    this.showForm = this.showForm.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.clearImage = this.clearImage.bind(this)
    this.editContent = this.editContent.bind(this)
    this.imageUpload = this.imageUpload.bind(this)
    this.checkSeconds = this.checkSeconds.bind(this)
    this.checkMinutes = this.checkMinutes.bind(this)
    this.updateMinutes = this.updateMinutes.bind(this)
    this.updateSeconds = this.updateSeconds.bind(this)
    this.editBackground = this.editBackground.bind(this)
    this.uploadBackground = this.uploadBackground.bind(this)
    this.addDecision = this.addDecision.bind(this)
    this.updateCurrentDecision = this.updateCurrentDecision.bind(this)
    this.saveCurrentDecision = this.saveCurrentDecision.bind(this)
    this.deleteCurrentDecision = this.deleteCurrentDecision.bind(this)
    this.editDecision = this.editDecision.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  showForm(key) {
    const decision = this.state.resource.decisions[key]
    this.setState({
      currentDecision: decision,
      currentDecisionKey: key,
      showForm: true,
    })
  }

  addDecision() {
    const slide = this.state.resource
    $.ajax({
      url: 'slideshow/Decision',
      data: {
        slideId: this.state.resource.id,
      },
      dataType: 'json',
      type: 'post',
      success: function(data) {
        const decision = data
        slide.decisions.push(decision)
        this.setState({
          resource: slide,
          currentDecision: decision,
          showForm: true,
        })
      }.bind(this),
      error: function() {}.bind(this),
    })
  }

  load() {
    $.getJSON('./slideshow/Slide/' + slideId).done(
      function(data) {
        this.setState({ resource: data })
      }.bind(this)
    )
  }

  closeForm() {
    this.setState({ showForm: false })
  }

  updateMinutes(e) {
    const value = e.target.value
    this.setState({ delayMinutes: value })
  }

  updateSeconds(e) {
    const value = e.target.value
    this.setState({ delaySeconds: value })
  }

  checkMinutes() {
    let finalMinutes = parseInt(this.state.delayMinutes)
    if (finalMinutes > 10) {
      finalMinutes = 10
    }
    this.setState({ delayMinutes: finalMinutes })
  }

  clearImage(e) {
    e.preventDefault()
    const slide = this.state.resource
    $.ajax({
      url: 'slideshow/Slide/' + slide.id + '/clearPicture',
      dataType: 'json',
      type: 'patch',
      success: function() {
        this.setValue('backgroundImage', '')
      }.bind(this),
      error: function() {}.bind(this),
    })
  }

  checkSeconds() {
    if (this.state.delaySeconds > 59) {
      let finalMinutes = Math.floor(this.state.delaySeconds / 60)
      let finalSeconds = parseInt(this.state.delaySeconds % 60)
      finalMinutes = parseInt(this.state.delayMinutes) + parseInt(finalMinutes)
      if (finalMinutes > 10) {
        finalMinutes = 10
        finalSeconds = 0
      }
      this.setState({ delayMinutes: finalMinutes, delaySeconds: finalSeconds })
    } else {
      this.setState({
        delaySeconds: parseInt(this.state.delaySeconds),
      })
    }
  }

  sendImage(file) {
    let formData = new FormData()
    formData.append('slideId', this.state.resource.id)
    formData.append('picture', file)

    return $.ajax({
      url: './slideshow/Slide/picture',
      data: formData,
      cache: false,
      dataType: 'json',
      type: 'post',
      processData: false,
      contentType: false,
    })
  }

  uploadBackground(fileList) {
    const response = this.sendImage(fileList[0])
    response.success(
      function(data) {
        this.setValue('backgroundImage', data.path)
        this.patchValue('backgroundImage', data.path)
      }.bind(this)
    )
  }

  imageUpload(fileList) {
    for (let file of fileList) {
      const response = this.sendImage(file)
      response.success(
        function(data) {
          ReactSummernote.insertImage(data.path, function(image) {
            image.addClass('img-responsive')
          })
        }.bind(this)
      )
    }
  }

  slideBackground() {
    const url = `url(${this.state.resource.backgroundImage})`
    return {
      backgroundImage: url,
      backgroundSize: 'auto 100%',
      backgroundRepeat: 'no-repeat',
    }
  }

  editContent() {
    this.setState({ currentForm: 'content', showForm: true })
  }

  getForm() {
    switch (this.state.currentForm) {
      case 'content':
        return (
          <ReactSummernote
            value={this.state.resource.content}
            options={options}
            onChange={this.setValue.bind(null, 'content')}
            onBlur={this.patchValue.bind(null, 'content')}
            onImageUpload={this.imageUpload}
          />
        )

      case 'background':
        return this.dropzone()

      case 'decision':
        return (
          <DecisionForm
            decision={this.state.currentDecision}
            save={this.saveCurrentDecision}
            deleteDecision={this.deleteCurrentDecision}
            update={this.updateCurrentDecision}
          />
        )
    }
  }

  dropzone() {
    const slide = this.state.resource
    const imageStyle = {
      maxHeight: '490px',
    }
    let clearButton
    let dropzoneImage = (
      <div className="default-image">
        <i className="fa fa-camera fa-5x" />
        <br />
        <h4>
          Click to browse<br />- or -<br />drag image here
        </h4>
      </div>
    )
    if (slide.backgroundImage !== null && slide.backgroundImage.length > 0) {
      clearButton = (
        <button className="btn btn-warning btn-sm" onClick={this.clearImage}>
          Clear
        </button>
      )
      dropzoneImage = (
        <img
          style={imageStyle}
          className="img-responsive"
          src={slide.backgroundImage}
        />
      )
    }
    return (
      <div>
        <Dropzone
          ref="dropzone"
          multiple={false}
          onDrop={this.uploadBackground}
          className="dropzone text-center pointer">
          {dropzoneImage}
        </Dropzone>
        {clearButton}
      </div>
    )
  }

  editBackground() {
    this.setState({ showForm: true, currentForm: 'background' })
  }

  editDecision(key) {
    const currentDecision = this.state.resource.decisions[key]
    this.setState({ showForm: true, currentForm: 'decision', currentDecision : currentDecision, currentDecisionKey: key })
  }

  hideForm() {
    this.setState({ showForm: false })
  }

  updateCurrentDecision(decision) {
    this.setState({ currentDecision: decision })
  }

  saveCurrentDecision() {
    const { currentDecision } = this.state
    $.ajax({
      url: './slideshow/Decision/' + currentDecision.id,
      data: currentDecision,
      dataType: 'json',
      type: 'put',
      success: function() {
        this.setState({ showForm: false, currentDecision: null, currentDecisionKey: null })
      }.bind(this),
      error: function() {}.bind(this),
    })
  }

  deleteCurrentDecision() {
    console.log('hi')
    $.ajax({
      url: './slideshow/Decision/' + this.state.currentDecision.id,
      dataType: 'json',
      type: 'delete',
      success: function() {
        const slide = this.state.resource
        slide.decisions.splice(this.currentDecisionKey, 1)
        this.setState({
          currentDecision: null,
          currentDecisionKey: null,
          resource: slide,
        })
      }.bind(this),
      error: function() {}.bind(this),
    })
  }

  render() {
    const slide = this.state.resource

    const styles = {
      fontSize: '20px',
    }
    const content = {
      __html: slide.content,
    }

    const modal = (
      <Modal
        isOpen={this.state.showForm}
        close={this.hideForm}
        width="90%"
        height="650px">
        <div>
          {this.getForm()}
          <hr />
          <div className="text-center">
            <button className="btn btn-primary" onClick={this.hideForm}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    )

    const viewLink = `./slideshow/Section/watch/${slide.sectionId}/#/${
      slide.sorting
    }`

    return (
      <div>
        {modal}
        <div className="container-fluid">
          <div id="slide-title">
            <InputField
              name="title"
              required={true}
              change={this.setValue.bind(null, 'title')}
              focus={true}
              styles={styles}
              blur={this.patchValue.bind(null, 'title')}
              placeholder="Title will not appear during the show"
              value={slide.title}
            />
          </div>
          <a
            href={`./slideshow/Section/${slide.sectionId}`}
            className="btn btn-default marginRight">
            <i className="fa fa-list" />&nbsp;Back to slide list
          </a>
          <a
            href={viewLink}
            target="_index"
            className="btn btn-default marginRight">
            <i className="fa fa-eye" />&nbsp;View
          </a>
          <button
            className="btn btn-primary marginRight"
            onClick={this.editBackground}>
            <i className="fa fa-picture-o" />&nbsp; Set background
          </button>
          <button
            className="btn btn-primary marginRight"
            onClick={this.editContent}>
            <i className="fa fa-edit" />&nbsp; Edit content
          </button>
        </div>
        <hr />
        <p>
          The slide below is an <strong>approximation</strong> of the final
          result.
        </p>
        <div className="reveal reveal-edit">
          <div
            dangerouslySetInnerHTML={content}
            id="slide-holder"
            style={this.slideBackground()}
          />
        </div>
        <Decision
          listing={this.state.resource.decisions}
          showForm={this.editDecision}
          add={this.addDecision}
        />
      </div>
    )
  }
}

Slide.propTypes = {}
