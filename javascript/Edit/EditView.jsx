'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Workspace from './Workspace.jsx'

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from 'draft-js-buttons'

import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin'
import 'draft-js-static-toolbar-plugin/lib/plugin.css'

const staticToolbar = createToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
  ]
})


const { Toolbar } = staticToolbar

const plugins = [
  staticToolbar,
]

export default class EditView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeIndex: props.currentSlide,
      toolBarActive: false,
      hasFocus: false,
    }
  }

  render() {
    let workspace = this.props.content.map(function(content) {
      // lol, the key is ridiculous, but it works!
      const key = "id" + content.id + "t" + content.type + "i" + this.props.currentSlide;
      return(
        <Workspace
          content = {content}
          plugins = {this.plugins}
          saveContentState = {this.props.saveContentState}
          currentSlide = {this.props.currentSlide}
          key = {key}
          deleteElement = {this.props.deleteElement} />)
    }.bind(this));

    return (
      <div className="col-8" >
        <p></p>
        <Toolbar />
        <span><br /></span>
        <div className="jumbotron">
          {workspace}
        </div>
      </div>
    )
  }

}


EditView.propTypes = {
  currentSlide: PropTypes.number,
  content: PropTypes.array,
  deleteElement: PropTypes.func,
  saveContentState: PropTypes.func,
}
