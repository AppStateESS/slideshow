'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class DecisionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <form method="post" action="./slideform/Decision">
        </form>
      </div>
    )
  }
}

DecisionForm.propTypes = {}
