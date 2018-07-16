import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, CardImg, Button } from 'reactstrap'
import './custom.css'

export default class ShowCard extends Component {
<<<<<<< 90d1b2dee082f26120dc33babcb5e9859dedbc0f
  constructor(props) {
    super(props)

    this.state = {
        id: -1,
        title: null,
        img: "https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180",
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
=======
  constructor() {
    super()
      this.state = {
          id: -1,
          title: null,
          img: "https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180",
          active: 0,
          color: "danger"
      }
      this.loadShow = this.loadShow.bind(this)
      this.view = this.view.bind(this)
      this.edit = this.edit.bind(this)
>>>>>>> Work in progress, get and post work.
  }

  componentDidMount() {
    //console.log(this.props.title);
    //this.loadShow(this.props.id)
    this.setState({

          title: this.props.title,
          //img: this.props.img,
<<<<<<< 90d1b2dee082f26120dc33babcb5e9859dedbc0f
          active: Number(this.props.active),
=======
          active: this.props.active,
>>>>>>> Work in progress, get and post work.
          id: this.props.id

    })
  }

<<<<<<< 90d1b2dee082f26120dc33babcb5e9859dedbc0f
 view() {

=======
/**
* Loads the details fome the back end - see Show.php
*/
 loadShow(id) {
   console.log("Made it");
   if (id !== -1) {
     $.getJSON('./slideshow/show/admin/getDetails', {show_id: id}).done(function (data) {
       this.setState({show: data})
     }.bind(this))

     this.setState({
       show: {
         title: "Fake Data Placeholder",
         img: "https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
       }
     })
   }
   else {
     this.setState({
       show: {
         title: "Test Show",
         img: "https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
       }
     })
   }
>>>>>>> Work in progress, get and post work.
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

<<<<<<< 90d1b2dee082f26120dc33babcb5e9859dedbc0f
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
=======
 edit() {
   console.log("made it");
>>>>>>> Work in progress, get and post work.
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
<<<<<<< 90d1b2dee082f26120dc33babcb5e9859dedbc0f
          <div className="card-img-caption">
            <a className="close card-text" aria-label="Close" onClick={this.deleteShow}>
              <span aria-hidden="true">&times;</span>
            </a>

            <img className="card-img-top" src={this.state.img}/>
          </div>
          <CardBody>
            <CardTitle className="d-flex justify-content-center">
              {cardTitle}
=======
          <CardImg top-width="100%" src={this.state.img}/>
          <CardBody>
            <CardTitle className="d-flex justify-content-center">
              {this.state.title}
              <a onClick={this.edit} style={{paddingLeft: "10px"}}> <i className="fas fa-edit fa-sm"></i> </a>
>>>>>>> Work in progress, get and post work.
            </CardTitle>
            <div className="d-flex justify-content-around">
              <Button onClick={this.view} color="primary">Present</Button>
              <Button onClick={this.edit} color="secondary">Edit</Button>
<<<<<<< 90d1b2dee082f26120dc33babcb5e9859dedbc0f
              <button type="button" className={activeBtnType} onClick={this.handleActivation} > {activeLabel} </button>
=======
              <Button onClick={this.active} color={this.state.color}>{this.state.active}</Button>
>>>>>>> Work in progress, get and post work.
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
