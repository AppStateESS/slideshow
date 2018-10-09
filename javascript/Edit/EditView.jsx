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

  componentDidMount() {
    // Could be used eventually, but too lazy to delete function.
  }

  componentDidUpdate(prevProps) {
    // This looks like a nightmare to figure out. So I just commented it out.

   // this might cause an issue when a state that isn't related to slide change updates.
   // Like hasFocus
   //
    // if (prevProps.content != this.props.content || prevProps.currentSlide !== this.props.currentSlide) {
    //   this.fetchContent(this.props)
    // }
  }

  render() {
    // Lazy with creating name.
    console.log("EditView:")
    console.log(this.props.content)
    let data = this.props.content.map(function(content) {
      // lol, the key is ridiculous, but it works!
      // Needs to be unique for a given slide AND unique between all slides
      return(
        <Workspace
          content = {content}
          plugins = {this.plugins}
          saveContentState = {this.props.saveContentState}
          save = {this.props.save}
          currentSlide = {this.props.currentSlide}
          key = {content.id + content.type + this.props.currentSlide}
          deleteElement = {this.props.deleteElement} />)
    }.bind(this));

    return (
      <div className="col-8" >
        <Toolbar />
        <span><br /></span>
        <div className="jumbotron">
          {data}
        </div>
      </div>
    )
  }

}


EditView.propTypes = {
  currentSlide: PropTypes.number,
  content: PropTypes.array,
  saveContentState: PropTypes.func,
  save: PropTypes.func
}
