import React, {Component} from 'react'
import Overlay from '../AddOn/Html/Overlay.jsx'
import Modal from '../AddOn/Html/Modal.jsx'
import ShowForm from './ShowForm.jsx'
import Waiting from '../AddOn/Html/Waiting.jsx'
import Listing from './Listing.jsx'

/* global $ */

export default class ShowList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
      list: [],
      loaded: false,
      message: null,
      mtype: 'info'
    }
    this.load = this.load.bind(this)
    this.showForm = this.showForm.bind(this)
    this.hideForm = this.hideForm.bind(this)
    this.showSaved = this.showSaved.bind(this)
    this.setMessage = this.setMessage.bind(this)
    this.clearMessage = this.clearMessage.bind(this)
  }

  componentDidMount(){
    this.load()
  }

  setMessage(message, type = 'info') {
    this.setState({message: message, mtype: type})
  }

  clearMessage() {
    this.setState({message: null, mtype: 'info'})
  }

  showForm() {
    this.setState({showForm: true})
  }

  hideForm() {
    this.setState({showForm: false})
  }

  load() {
    $.getJSON('./slideshow/Show/list').done(function (data) {
      this.setState({loaded: true, list: data,})
    }.bind(this)).fail(function(){
      this.setMessage('Failed loading shows', 'danger')
      this.setState({loaded:true})
    }.bind(this))
  }

  showSaved() {
    this.hideForm()
    this.load()
  }

  overlay() {
    if (!this.state.showForm) {
      return
    } else {
      return <Overlay title="Create new show" close={this.hideForm}><ShowForm/></Overlay>
    }
  }

  render() {
    let listing = <Waiting label="shows"/>
    if (this.state.loaded) {
      if (this.state.list[0] != null) {
        listing = <Listing list={this.state.list}/>
      } else {
        listing = <p>No shows found</p>
      }
    }
    return (
      <div>
        <Modal isOpen={this.state.showForm} close={this.hideForm}><ShowForm success={this.showSaved}/></Modal>
        <button className="btn btn-primary" onClick={this.showForm}>Create new show</button>
        <hr />
        {listing}
      </div>
    )
  }
}
