'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'
import './custom.css'

export default class SessionTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userData: null,
      sessionFlag: null,
      sortStatus: false
    }
        this.getSessionInfo = this.getSessionInfo.bind(this)
        this.sortStatus = this.sortStatus.bind(this)
        this.compare = this.compare.bind(this)
  }

  componentDidMount() {
    this.getSessionInfo()
  }

  getSessionInfo() {
    $.ajax({
      url: './slideshow/Session/' + window.sessionStorage.getItem('id'),
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        this.setState({showData: data})
      }.bind(this)
    })
  }

  sortStatus() {
    let sortData = [...this.state.showData]
    sortData.sort((b, a) => {
        return this.compare(b, a)
    })
    this.setState({showData: sortData, sortStatus: !this.state.sortStatus})
  }

  compare(b, a) {
      if (this.state.sortStatus){
          let x = b
          b = a
          a = x
      }
      // order logic
      if (Number(a.highestSlide) == 0) {
        return 1 //a is not Started
      }
      else if (a.completed == 1) {
        return -1 //a is completed
      }
      else {
        //a is in progress
        if (b.completed == 1) {
          return 1
        }
        else if (b.highestSlide == 0) {
          return -1
        }
        else {
          return 0
        }
      }
  }

  render() {
    let tableData = undefined
    let status = undefined
    if (this.state.showData != null){
      tableData = this.state.showData.map((row) => {
        if (Number(row.highestSlide) == 0) {
          status = <td><div style = {{color: '#dc3545'}}><i className="fas fa-times-circle" style= {{marginRight: 10}}></i>Not started</div></td>
        }
        else if (Number(row.completed)) {
          status = <td><div style = {{color: '#28a745'}}><i className="fas fa-check-circle" style= {{marginRight: 10}}></i>Complete</div></td>
        }
        else if(Number(row.highestSlide) > 0) {
          status= <td><div style = {{color: '#ffc107'}}><i className="fas fa-exclamation-circle" style= {{marginRight: 10}}></i>In progress</div></td>
        }
        return (
          <tr key={row.username}>
            <td><span>{row.username}</span></td>
            {status}
          </tr>
        )
      })
    }

    return (
      <div>
      <h1 style={{padding: 10}}><u>{window.sessionStorage.getItem('title')}</u></h1>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Username</th>
            <th onClick= {this.sortStatus}>Status <i className="fas fa-sort"></i></th>
          </tr>
        </thead>
        <tbody>
          {tableData}
        </tbody>
      </Table>
      </div>
    )
  }
}
