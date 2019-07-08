import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Button,
  Alert,
  InputGroup,
  FormControl,
  Overlay,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import './custom.css'

import ShowLogo from "../../img/showimg.png"

export default class ShowCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
        id: -1,
        title: null,
        img: ShowLogo,
        active: 0,
        edit: false,
        alert: false,
        closex: true
    }

    this.handleSave = this.handleSave.bind(this)
    this.deleteShow = this.deleteShow.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.handleActivation = this.handleActivation.bind(this)
    this.editTransition = this.editTransition.bind(this)
    this.presentTransition = this.presentTransition.bind(this)
    this.sessionTransition = this.sessionTransition.bind(this)
    this.deleteAlert = this.deleteAlert.bind(this)
  }

  componentDidMount() {
    this.setState({
      title: this.props.title,
      active: Number(this.props.active),
      id: this.props.id
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
     error: (req, res) => {
       console.log("Error Deleting Slides")
       console.error(req, res.toString())
     }
   })
   $.ajax({
     url: './slideshow/Show/' + this.state.id,
     type: 'delete',
     dataType: 'json',
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
   window.location.href = './slideshow/Slide/Edit/'
 }

 presentTransition() {
   window.sessionStorage.setItem('id', this.state.id)
   window.location.href = './slideshow/Slide/Present/'
 }

 sessionTransition() {
   console.log('success')
   window.sessionStorage.setItem('id', this.state.id)
   window.sessionStorage.setItem('title', this.state.title)
   window.location.href = './slideshow/Session/table'
 }

 deleteAlert() {
   this.setState({
     alert: !this.state.alert,
     closex: !this.state.closex
   })
 }

  render() {
    let cardTitle;
    if (this.state.edit) {
      cardTitle = <InputGroup>
                    <FormControl
                      value={this.state.title}
                      onChange={this.updateTitle}
                    />
                    <InputGroup.Append>
                      <Button variant="primary" onClick={this.handleSave}>Save</Button>
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

    const delAlert = <div className="alert-delete">
                       <Alert variant="danger" className="text-danger" show={this.state.alert} onClose={this.deleteAlert} dismissible>
                         <span style={{marginLeft: 30}}>Are you sure?</span>
                         <Button style={{marginLeft: 20}} variant="outline-danger" onClick={this.deleteShow}>Delete</Button>
                       </Alert>
                     </div>
    let activeX = (this.state.closex) ? (<a className="close card-text" aria-label="Close" onClick={this.deleteAlert}>
                                          <span aria-hidden="true">&times;</span>
                                         </a>) : undefined

    let session = <OverlayTrigger placement="top"
                   overlay={
                    <Tooltip>
                      View user progress
                    </Tooltip>
                   }>
                   <span onClick={this.sessionTransition}>
                        <a className="fas fa-users"></a>
                   </span>
                 </OverlayTrigger>

    return (
      <div style={{paddingBottom: "25px"}}>
        {delAlert}
        <Card>
          <div className="card-img-caption">
            <div className="card-user">{session}</div>
            {activeX}
            <img className="card-img-top" src={this.state.img}/>
          </div>
          <Card.Body>
            <Card.Title className="d-flex justify-content-center">
              {cardTitle}
            </Card.Title>
            <div className="d-flex justify-content-around">
              <Button onClick={this.presentTransition} variant="primary">Present</Button>
              <Button onClick={this.editTransition} variant="secondary">Edit</Button>
              <OverlayTrigger placement="bottom"
                overlay={
                  <Tooltip>
                    Activate for students
                  </Tooltip>
                  }>
              <button type="button" className={activeBtnType} onClick={this.handleActivation} > {activeLabel} </button>
              </OverlayTrigger>
            </div>
          </Card.Body>
        </Card>
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
