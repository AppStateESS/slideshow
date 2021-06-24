import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './custom.css'

import ShowLogo from '../../img/showimg.png'
import PreviewUpload from './PreviewUpload'
import SessionTool from './SessionTool'
import DeleteShowTool from './DeleteShowTool'
import Tippy from '@tippyjs/react'

/* global $ */
export default class ShowCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: -1,
      title: null,
      img: ShowLogo,
      active: 0,
      edit: false,
      useThumb: false,
    }
    this.handleSave = this.handleSave.bind(this)
    this.deleteShow = this.deleteShow.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.handleActivation = this.handleActivation.bind(this)
    this.editTransition = this.editTransition.bind(this)
    this.presentTransition = this.presentTransition.bind(this)
    this.sessionTransition = this.sessionTransition.bind(this)
    this.changePreview = this.changePreview.bind(this)
    this.useThumb = this.useThumb.bind(this)
    this.submitOnEnter = this.submitOnEnter.bind(this)
  }

  componentDidMount() {
    this.setState({
      title: this.props.title,
      active: Number(this.props.active),
      id: this.props.id,
      img: this.props.img.length > 0 ? this.props.img : ShowLogo,
    })
  }

  handleSave() {
    $.ajax({
      url: './slideshow/Show/' + this.state.id,
      data: {title: this.state.title, active: this.state.active},
      type: 'put',
      dataType: 'json',
      success: function () {
        this.setState({edit: false})
        this.props.load()
      }.bind(this),
      error: function (req, err) {
        alert('Failed to save data.')
        console.error(req, err.toString())
      }.bind(this),
    })
  }

  deleteShow() {
    $.ajax({
      url: './slideshow/Quiz/' + this.state.id,
      type: 'delete',
      dataType: 'json',
      data: {type: 'all'},
      success: (res) => {
        console.log(res)
      },
      error: (req, res) => {
        console.error(res)
      },
    })
    $.ajax({
      url: './slideshow/Slide/' + this.state.id,
      type: 'delete',
      dataType: 'json',
      data: {type: 'all'},
      error: (req, res) => {
        console.log('Error Deleting Slides')
        console.error(req, res.toString())
      },
    })
    $.ajax({
      url: './slideshow/Show/' + this.state.id,
      type: 'delete',
      dataType: 'json',
      data: {type: 'show'},
      success: function () {
        this.props.load()
      }.bind(this),
      error: function (req, err) {
        alert('Failed to delete data.')
        console.error(req, err.toString())
      }.bind(this),
    })
  }

  editTitle() {
    this.setState({edit: true})
  }

  updateTitle(event) {
    this.setState({
      title: event.target.value,
    })
  }

  handleActivation() {
    if (this.state.active > 0) {
      this.setState({active: 0}, () => {
        this.handleSave()
      })
    } else {
      this.setState({active: 1}, () => {
        this.handleSave()
      })
    }
  }

  async editTransition() {
    await window.sessionStorage.setItem('id', this.state.id)
    window.location.href = './slideshow/Slide/Edit/'
  }

  async presentTransition() {
    await window.sessionStorage.setItem('id', this.state.id)
    window.location.href = './slideshow/Slide/Present/'
  }

  async sessionTransition() {
    await window.sessionStorage.setItem('id', this.state.id)
    window.sessionStorage.setItem('title', this.state.title)
    window.location.href = './slideshow/Session/table'
  }

  changePreview(imgPath) {
    if (imgPath == undefined) {
      imgPath = ShowLogo
    }
    this.setState({img: imgPath})
  }

  useThumb(enable) {
    $.ajax({
      url: `./slideshow/Show/useThumb?id=${this.state.id}`,
      type: 'POST',
      data: {value: enable},
      success: (thumb) => {
        if (thumb.length > 0) {
          this.changePreview(JSON.parse(thumb))
        }
      },
      error: (req, res) => {
        console.log(req)
        console.error(res)
      },
    })
  }

  submitOnEnter(event) {
    if (event.key === 'Enter') {
      this.handleSave()
    }
  }

  render() {
    let cardTitle
    if (this.state.edit) {
      cardTitle = (
        <div className="input-group w-auto">
          <input
            type="text"
            className="form-control"
            value={this.state.title}
            onChange={this.updateTitle}
            onKeyDown={this.submitOnEnter}
          />
          <div className="input-group-append">
            <button className="btn btn-primary" onClick={this.handleSave}>
              Save
            </button>
          </div>
        </div>
      )
    } else {
      cardTitle = (
        <div style={{maxWidth: 250, textAlign: 'center'}}>
          {this.state.title}
          <a
            onClick={this.editTitle}
            style={{paddingLeft: '10px', cursor: 'pointer'}}>
            <i className="fas fa-edit fa-sm"></i>
          </a>
        </div>
      )
    }

    let activeLabel = this.state.active !== 0 ? 'Active' : 'Inactive'
    let activeBtnType =
      this.state.active !== 0
        ? 'btn btn-outline-success'
        : 'btn btn-outline-danger'

    if (this.props.disabled) return null
    return (
      <div style={{paddingBottom: '25px'}}>
        <div className="card">
          <div className="card-img-caption">
            <img
              className="card-img-top"
              src={this.state.img}
              alt={'An error has occured with displaying this image'}
            />
          </div>
          <div className="card-body">
            <div className="card-title">
              <div className="d-flex justify-content-center">
                <h5 style={{width: 250, height: 30, border: '0px solid'}}>
                  {cardTitle}
                </h5>
              </div>
            </div>
            <div
              className="d-flex justify-content-around"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                border: '1px black',
              }}>
              <PreviewUpload
                id={this.state.id}
                changePreview={this.changePreview}
                useThumb={this.useThumb}
              />
              <SessionTool sessionTransition={this.sessionTransition} />
              <DeleteShowTool delete={this.deleteShow} />
            </div>
            <hr></hr>
            <div className="d-flex justify-content-around">
              <button
                className="btn btn-secondary"
                onClick={this.editTransition}
                style={{width: 82}}>
                Edit
              </button>
              <Tippy
                content={<div>Activate for students</div>}
                placement="bottom"
                arrow={true}>
                <button
                  type="button"
                  className={activeBtnType}
                  onClick={this.handleActivation}
                  style={{width: 82}}>
                  {' '}
                  {activeLabel}{' '}
                </button>
              </Tippy>
              <button
                className="btn btn-primary"
                onClick={this.presentTransition}>
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ShowCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  active: PropTypes.string,
  img: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  load: PropTypes.func,
  disabled: PropTypes.bool,
}
