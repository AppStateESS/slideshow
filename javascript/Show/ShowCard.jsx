import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, CardImg, Button } from 'reactstrap'
import './custom.css'

//import AppLogo from "../../img/{NAME}.png"

export default class ShowCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
        id: -1,
        title: null,
        img: null, // AppLogo
        active: 0,
        edit: false
    }
//      this.loadShow = this.loadShow.bind(this)
    this.view = this.view.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.deleteShow = this.deleteShow.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.handleActivation = this.handleActivation.bind(this)
    this.editTransition = this.editTransition.bind(this)
    this.presentTransition = this.presentTransition.bind(this)
  }

  componentDidMount() {
    this.setState({

          title: this.props.title,
          //img: this.props.img,
          active: Number(this.props.active),
          id: this.props.id

    })
  }

 view() {

 }

 handleSave() {
   // handles the update of the resource object
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
   // Call by ajax - demo purposes only
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
   window.location.href = './slideshow/Show/Edit/?id=' + this.state.id
 }

 presentTransition() {
  window.sessionStorage.setItem('id', this.state.id)
  window.location.href = './slideshow/Show/Present/?id=' + this.state.id
 }

  render() {
    let cardTitle;
    if (this.state.edit) {
      cardTitle = <div className="input-group">
                    <input type="text" className="form-control" placeholder={this.state.title} onChange={this.updateTitle}/>
                    <div className="input-group-append">
                      <button type="button" className="btn btn-outline-primary" onClick={this.handleSave}>Save</button>
                    </div>
                  </div>
    } else {
      cardTitle = <div>
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
        <Card>
          <div className="card-img-caption">
            <a className="close card-text" aria-label="Close" onClick={this.deleteShow}>
              <span aria-hidden="true">&times;</span>
            </a>

            <img className="card-img-top" src={this.state.img}/>
          </div>
          <CardBody>
            <CardTitle className="d-flex justify-content-center">
              {cardTitle}
            </CardTitle>
            <div className="d-flex justify-content-around">
              <Button onClick={this.presentTransition} color="primary">Present</Button>
              <Button onClick={this.editTransition} color="secondary">Edit</Button>
              <button type="button" className={activeBtnType} onClick={this.handleActivation} > {activeLabel} </button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

}

// ShowCard.propTypes = {
//   id: PropTypes.number
// }
