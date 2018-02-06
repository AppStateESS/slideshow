"use strict"
import React, { Component } from "react"
import PropTypes from "prop-types"
import DecisionList from "./DecisionList"

export default class Decision extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <button className="pull-right btn btn-primary" onClick={this.props.add}>
          <i className="fa fa-plus" />&nbsp;Add decision
        </button>
        <div>
          <DecisionList
            listing={this.props.listing}
            showForm={this.props.showForm}
          />
        </div>
      </div>
    )
  }
}

Decision.propTypes = {
  listing: PropTypes.array,
  add: PropTypes.func,
  showForm: PropTypes.func,
}
