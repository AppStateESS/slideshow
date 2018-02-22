'use strict'
import React, {Component} from 'react'
import EditForm from './EditForm'
import Modal from '../AddOn/Html/Modal'
import ShowRow from './ShowRow'
import DeletePrompt from './DeletePrompt'
import ShowResource from '../Resources/ShowResource'

/* global $ */

export default class ShowList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listing: null,
      showKey: -1,
      showModal: false,
      modalType: 'edit',
      title: '',
      show: ShowResource,
    }
    this.save = this.save.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.showListing = this.showListing.bind(this)
    this.deleteShow = this.deleteShow.bind(this)
    this.deletePrompt = this.deletePrompt.bind(this)
    this.setShow = this.setShow.bind(this)
    this.update = this.update.bind(this)
    this.toggleActive = this.toggleActive.bind(this)
  }

  clearForm() {
    this.setState({title: '', showModal: false, showKey: -1, show: ShowResource})
  }

  componentDidMount() {
    $('#createShow').click(function () {
      this.setState({showModal: true, modalType: 'edit'})
    }.bind(this))
    this.load()
  }

  deletePrompt(key) {
    this.setShow(key)
    this.setState({showModal: true, modalType: 'delete'})
  }

  deleteShow() {
    $.ajax({
      url: './slideshow/Show/' + this.state.show.id,
      data: {},
      dataType: 'json',
      type: 'delete',
      success: function () {
        this.removeShow()
        this.clearForm()
      }.bind(this),
      error: function () {}.bind(this),
    })
  }

  editForm(key) {
    this.setShow(key)
    this.setState({showModal: true, modalType: 'edit'})
  }

  load() {
    $.getJSON('./slideshow/Show/list').done(function (data) {
      this.setState({listing: data.listing})
    }.bind(this))
  }

  removeShow() {
    let listing = this.state.listing
    listing.splice(this.state.showKey, 1)
  }

  render() {
    let modalContent
    if (this.state.modalType == 'edit') {
      modalContent = (
        <EditForm
          show={this.state.show}
          save={this.save}
          close={this.clearForm}
          update={this.update}/>
      )
    } else {
      modalContent = (
        <DeletePrompt
          deleteShow={this.deleteShow}
          close={() => this.setState({showModal: false})}/>
      )
    }

    return (
      <div>
        <Modal
          isOpen={this.state.showModal}
          height="250px"
          close={() => this.setState({showModal: false})}>{modalContent}</Modal>
        <h2>Shows</h2>
        {this.showListing()}
      </div>
    )
  }

  save() {
    const show = this.state.show
    let url = './slideshow/Show'
    let type = 'post'
    if (show.id > 0) {
      url = url + '/' + show.id
      type = 'put'
    }
    $.ajax({
      url: url,
      data: show,
      dataType: 'json',
      type: type,
      success: function (data) {
        this.clearForm()
        let listing = this.state.listing
        listing.push(data.show)
        this.setState({listing})
      }.bind(this),
      error: function () {}.bind(this)
    })
  }

  setShow(showKey = -1, callback) {
    let show
    if (showKey == -1) {
      show = ShowResource
    } else {
      show = this.state.listing[showKey]
    }
    this.setState({
      show,
      showKey
    }, callback)
  }

  showListing() {
    if (this.state.listing == null || this.state.listing.length == 0) {
      return <div>No shows available.&nbsp;
        <button
          className="btn btn-success btn-sm"
          onClick={() => this.setState({showModal: true, modalType: 'edit'})}>
          <i className="fa fa-plus"></i>&nbsp;Create a new show.</button>
      </div>
    } else {
      let listing = this.state.listing.map(function (value, key) {
        return (
          <ShowRow
            key={key}
            {...value}
            deletePrompt={this.deletePrompt.bind(this, key)}
            toggleActive={this.toggleActive.bind(this, key)}
            editForm={this.editForm.bind(this, key)}/>
        )
      }.bind(this))
      return (
        <table className="table table-striped">
          <tbody>
            {listing}
          </tbody>
        </table>
      )
    }
  }

  toggleActive(key) {
    this.setShow(key, () => {
      this.update(
        'active',
        this.state.show.active == '1'
          ? '0'
          : '1'
      )
      this.save()
    })

  }

  update(varname, value) {
    const show = this.state.show
    show[varname] = value
    this.setState({show})
  }

  updateListing() {
    const show = this.state.show
    let listing = this.state.listing
    listing[this.state.showKey] = show
    this.setState({listing})
  }
}
