import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  InputGroup,
  FormControl,
} from 'react-bootstrap'
import './custom.css'

import ShowLogo from "../../img/showimg.png"

import PreviewUpload from "./PreviewUpload";
import SessionTool from './SessionTool';
import DeleteShowTool from './DeleteShowTool';
import Tippy from '@tippy.js/react';

export default class ShowCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
        id: -1,
        title: null,
        img: ShowLogo,
        active: 0,
        edit: false,
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
    this.submitOnEnter = this.submitOnEnter.bind(this)
  }

  componentDidMount() {
    this.setState({
      title: this.props.title,
      active: Number(this.props.active),
      id: this.props.id,
      img: this.props.img.length > 0 ? this.props.img : ShowLogo 
    })
  }

 handleSave() {
   $.ajax({
     url: './slideshow/Show/' + this.state.id,
     data: {title: this.state.title, active: this.state.active},
     type: 'put',
     dataType: 'json',
     success: function() {
       this.setState({edit: false})
       this.props.load();
     }.bind(this),
     error: function(req, err) {
       alert("Failed to save data.")
       console.error(req, err.toString());
     }.bind(this)
   });
 }

 deleteShow() {
   $.ajax({
     url: './slideshow/Slide/' + this.state.id,
     type: 'delete',
     dataType: 'json',
     data: {type: 'all'},
     error: (req, res) => {
       console.log("Error Deleting Slides")
       console.error(req, res.toString())
     }
   })
   $.ajax({
     url: './slideshow/Show/' + this.state.id,
     type: 'delete',
     dataType: 'json',
     data: {type: 'show'},
     success: function() {
       this.props.load()
     }.bind(this),
     error: function(req, err) {
       alert("Failed to delete data.")
       console.error(req, err.toString());
     }.bind(this)
   });
 }

 editTitle() {
   this.setState({edit: true})
 }

 updateTitle(event) {
   this.setState({
     title: event.target.value
   })
 }

 handleActivation() {
   this.state.active > 0 ? this.setState({active: 0}, function(){this.handleSave()}) :
                           this.setState({active: 1}, function(){this.handleSave()})
 }

 editTransition() {
   window.sessionStorage.setItem('id', this.state.id)
   window.setTimeout(() => window.location.href = './slideshow/Slide/Edit/', 200)
 }

 presentTransition() {
   window.sessionStorage.setItem('id', this.state.id)
   window.setTimeout(() => window.location.href = './slideshow/Slide/Present/', 200)
 }

 sessionTransition() {
   console.log('success')
   window.sessionStorage.setItem('id', this.state.id)
   window.sessionStorage.setItem('title', this.state.title)
   window.setTimeout(() => window.location.href = './slideshow/Session/table', 200)
 }


 changePreview(imgPath) {
   if (imgPath == undefined) {
     imgPath = ShowLogo
   }
   this.setState({img: imgPath})
 }

 submitOnEnter(event) {
   if (event.key === "Enter") {
     this.handleSave()
   }
 }

  render() {
    let cardTitle;
    if (this.state.edit) {
      cardTitle = <InputGroup>
                    <FormControl
                      value={this.state.title}
                      onChange={this.updateTitle}
                      onKeyDown={this.submitOnEnter}
                    />
                    <InputGroup.Append>
                      <button className="btn btn-primary" onClick={this.handleSave}>Save</button>
                    </InputGroup.Append>
                  </InputGroup>
    } else {
      cardTitle = <div style={{maxWidth: 250, textAlign: 'center'}}>
                    {this.state.title}
                    <a onClick={this.editTitle} style={{paddingLeft: "10px", cursor: "pointer"}}>
                      <i className="fas fa-edit fa-sm"></i>
                    </a>
                  </div>
    }

    let activeLabel = (this.state.active !== 0) ? "Active" : "Inactive"
    let activeBtnType = (this.state.active !== 0) ? "btn btn-outline-success" : "btn btn-outline-danger"

    return (
      <div style={{paddingBottom: "25px"}}>
        <div className="card">
          <div className="card-img-caption">
            <img className="card-img-top" src={this.state.img}/>
          </div>
          <div className="card-body">
            <div className="card-title">
              <div className="d-flex justify-content-center">
                <h5>{cardTitle}</h5>
              </div>
            </div>
            <div className="d-flex justify-content-around" style={{marginBottom: 10, marginLeft: 'auto', marginRight: 'auto', border: '1px black' }}>
              <PreviewUpload id={this.state.id} changePreview={this.changePreview}/>
              <SessionTool sessionTransition={this.sessionTransition} />
              <DeleteShowTool delete={this.deleteShow} />
            </div>
            <hr></hr>
            <div className="d-flex justify-content-around">
              <button className="btn btn-primary" onClick={this.presentTransition} >View</button>
              <button className="btn btn-secondary" onClick={this.editTransition} >Edit</button>
              <Tippy content={<div>Activate for students</div>} placement="bottom" arrow={true}>
                <button type="button" className={activeBtnType} onClick={this.handleActivation} > {activeLabel} </button>
              </Tippy>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

ShowCard.propTypes = {
   //id: PropTypes.number,
   title: PropTypes.string,
   //active: PropTypes.string,
   //load: PropTypes.function
 }
