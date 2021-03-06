import React, {useEffect, useState} from 'react'
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  KeyBindingUtil,
  convertToRaw,
  convertFromRaw,
} from 'draft-js'
import CustomBlockFn from '../Resources/Draft/CustomBlockFn'
import CustomStyleMap from '../Resources/Draft/CustomStyleMap'
import decorator from '../Resources/Draft/LinkDecorator'

import Toolbar from './Toolbar/Toolbar'
import ImageC from './AddOn/ImageColumn'
import PropTypes from 'prop-types'

//const {hasCommandModifier} = KeyBindingUtil

/** Props:
 * readOnly : boolean // Ensures the editor is non-ediable and the toolbar doesn't appear
 * content : Object<SlideContent>
 * currentSlide : number
 * saveContentState : function // saves extracted contentState and appends it to content : Object<SlideContent>
 */

export default function DraftEditor(props) {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  )

  useEffect(() => {
    loadEditorState()
  }, [props.currentSlide])

  useEffect(() => {
    saveEditorState(editorState)
  }, [editorState])

  function loadEditorState() {
    // If we aren't loading a quiz
    // If there isn't any content then we make some
    if (props.content.saveContent == undefined) {
      const eState = EditorState.createWithContent(
        ContentState.createFromText('New Slide'),
        decorator
      )
      // Set inital block type to H1
      setEditorState(RichUtils.toggleBlockType(eState, 'header-one'))
    } else {
      if (props.content.saveContent.length > 0) {
        const contentState = convertFromRaw(
          JSON.parse(props.content.saveContent)
        )
        setEditorState(EditorState.createWithContent(contentState, decorator))
      } else {
        // This means that content is defined but there is no data to be read
        console.log(
          'An error has occured. Your data may have been corrupted. This slide will be reset.'
        )
        const eState = EditorState.createWithContent(
          ContentState.createFromText('New Slide'),
          decorator
        )
        setEditorState(RichUtils.toggleBlockType(eState, 'header-one'))
      }
    }
  }

  function saveEditorState() {
    if (editorState != undefined && !props.readOnly) {
      // See draft.js documentation to understand what these are:
      let contentState = editorState.getCurrentContent()
      let saveContent = JSON.stringify(convertToRaw(contentState))

      props.saveContentState(saveContent)
    }
  }

  // Previously commented code can be read here:
  //https://github.com/AppStateESS/slideshow/blob/549affb8e45a498a293d7a8ab04dd3983ef9f965/javascript/Edit/DraftEditor.jsx#L62

  /* Custom styles mappings for Draft Editor Begin */
  let styles = CustomStyleMap
  if (editorState != undefined) {
    // This adds custom styles to the mix
    editorState.getCurrentInlineStyle().map((customStyle) => {
      if (customStyle != undefined) {
        let styleObj = undefined
        // Custom text color
        if (customStyle.charAt(0) === '#') {
          styleObj = JSON.parse(
            '{"' + customStyle + '":{"color":"' + customStyle + '"}}'
          )
        } // Custom font sizes would be added as an else if here
        if (styleObj != undefined) {
          styles = Object.assign(styleObj, CustomStyleMap)
        }
      }
    })
  }
  //background styling check image or color
  let backgroundStyle = {
    minHeight: 500,
    minWidth: 300,
    height: '8rem',
    overflow: 'auto',
    backgroundImage: `url(${props.content.background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
  if (props.content.background.charAt(0) === '#') {
    backgroundStyle = {
      minHeight: 500,
      minWidth: 300,
      height: '8rem',
      overflow: 'auto',
      backgroundColor: props.content.background,
    }
  }

  /* Image Column Initalization */
  let imgC = undefined
  let imgAlign = undefined
  if (props.content.media != undefined) {
    imgC = (
      <ImageC
        key={props.content.media.imgUrl}
        src={props.content.media.imgUrl}
        remove={props.removeMedia}
        align={(a) => props.saveMedia(props.content.media.imgUrl, a)}
        mediaAlign={props.content.media.align}
        height={'100%'}
        width={'100%'}
      />
    )
    imgAlign = props.content.media.align
  }

  return (
    <div className="col" style={{marginTop: 15}}>
      {props.readOnly ? undefined : (
        <Toolbar
          setEditorState={(eState) => setEditorState(eState)}
          getEditorState={() => editorState}
          saveMedia={props.saveMedia}
          saveBackground={props.saveBackground}
        />
      )}
      <br></br>
      <div
        id="editor"
        data-key={props.currentSlide}
        className="jumbotron"
        style={backgroundStyle}>
        <div className="row">
          {imgAlign === 'left' ? imgC : undefined}
          <div className="col">
            <div className="cust-col-11" style={{padding: '5px'}}>
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                //handleKeyCommand={this.handleKeyCommand}
                //keyBindingFn={this.functions}
                //onFocus={() => this.setState({ hasFocus: true })}
                //onBlur={() => this.setState({ hasFocus: false })}
                customStyleMap={styles}
                blockStyleFn={CustomBlockFn}
                spellCheck={true}
                readOnly={props.readOnly}
              />
            </div>
          </div>
          {imgAlign === 'right' ? imgC : undefined}
        </div>
      </div>
    </div>
  )
}

DraftEditor.propTypes = {
  currentSlide: PropTypes.number,
  content: PropTypes.object,
  readOnly: PropTypes.bool,
  saveContentState: PropTypes.func,
  removeMedia: PropTypes.func,
  saveMedia: PropTypes.func,
  saveBackground: PropTypes.func,
}
