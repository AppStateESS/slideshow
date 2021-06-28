import React, { useState } from 'react'
import PropTypes from 'prop-types'

import QuizEdit from './Quiz/QuizEdit.jsx'
import QuizView from './Quiz/QuizView.jsx'
import Editor from './DraftEditor'
import ToolbarQ from './Toolbar/QuizToolbar.jsx'
import { Modal } from 'react-bootstrap'
import Dropzone from 'react-dropzone-uploader'
import ImageC from './AddOn/ImageColumn'


const EditView = ({
  content,
  currentSlide,
  saveContentState,
  saveMedia,
  removeMedia,
  saveBackground,
  saveQuizContent,
  load,
}) => {
  const [editView, setEditView] = useState(false)
  const [mediaView, setMediaView] = useState(false)
  //const [mediaAlign, setMediaAlign] = useState('right')
  const mediaAlign = 'right'


  function mediaOpen() {
    setMediaView(true)
  }

  function mediaCancel() {
    setMediaView(false)
  }

  function validate({ meta }) {
    if (meta.status === 'rejected_file_type') {
      alert('Sorry, this file type is not supported')
    }
  }

  function insertMedia(fileWithMeta) {
    let showId = Number(window.sessionStorage.getItem('id'))
    let slideId = Number(window.sessionStorage.getItem('slideId'))
    // Handle AJAX
    let fMeta = fileWithMeta[0]
    let formData = new FormData()
    formData.append('media', fMeta.file)
    formData.append('slideId', slideId)
    formData.append('id', showId)

    $.ajax({
      url: './slideshow/Slide/image/' + window.sessionStorage.getItem('id'),
      type: 'post',
      data: formData,
      processData: false,
      contentType: false,
      success: (imageUrl) => {
        saveMedia(JSON.parse(imageUrl), 'right')
        if (content.isQuiz) {
          alert("Image has been Saved")
        }
      },
      error: (req, res) => {
        console.log(req)
        console.error(res)
        alert(
          'An error has occured with this image. Please try a different image.'
        )
      },
    })
    setMediaView(false)
  }


  let imgC = undefined
  let imgAlign = undefined
  if (content.media != undefined) {
    imgC = (
      <ImageC
        key={content.media.imgUrl}
        src={content.media.imgUrl}
        remove={removeMedia}
        align={(a) => saveMedia(content.media.imgUrl, a)}
        mediaAlign={content.media.align}
        height={'100%'}
        width={'100%'}
      />
    )
    imgAlign = content.media.align
  }

  if (!content.isQuiz) {
    return (
      <Editor
        key={currentSlide}
        content={content}
        saveContentState={saveContentState}
        currentSlide={currentSlide}
        saveMedia={saveMedia}
        removeMedia={removeMedia}
        saveBackground={saveBackground}
        insertMedia={insertMedia}
        validate={validate}
        mediaView={mediaView}
        mediaCancel={mediaCancel}
        mediaOpen={mediaOpen}
      />
    )
  }
  if (editView || content.quizContent == null) {
    return (
      <div className="col" style={{ marginTop: 12 }}>
        <ToolbarQ
          toggleQuizEdit={() => setEditView(!editView)}
          view={editView}
        />
        <span id="space_between_the_toolbar" style={{ padding: 1 }}></span>
        <QuizEdit
          quizContent={content.quizContent}
          saveQuizContent={saveQuizContent}
          toggle={() => setEditView(false)}
          load={load}
          validate={validate}
          insertMedia={insertMedia}
          mediaView={mediaView}
          mediaCancel={mediaCancel}
          mediaOpen={mediaOpen}
        />
      </div>
    )
  }
  return (
    <div className="col" style={{ paddingTop: 12 }}>
      <div style={{ minWidth: 700 }}>
        <ToolbarQ
          toggleQuizEdit={() => setEditView(!editView)}
          view={editView}
        />
        <span id="space_between_the_toolbar" style={{ padding: 1 }}></span>
        <div
          id="editor"
          data-key={currentSlide}
          className="jumbotron"
          style={{
            minHeight: 500,
            minWidth: 300,
            height: '8rem',
            backgroundColor: content.background,
            overflow: 'auto',
          }}>
          <div className="row">
           {imgAlign === 'left' ? imgC : undefined}
            <div className="col">
              <QuizView
                quizContent={content.quizContent}
                toggle={() => setEditView(true)}
              />
            </div>
            {imgAlign === 'right' ? imgC : undefined}
          </div>
        </div>
      </div>
    </div>
  )
}

EditView.propTypes = {
  content: PropTypes.object,
  currentSlide: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  saveMedia: PropTypes.func,
  removeMedia: PropTypes.func,
  saveContentState: PropTypes.func,
  saveBackground: PropTypes.func,
  saveQuizContent: PropTypes.func,
  load: PropTypes.func,
  insertMedia: PropTypes.func,
  validate: PropTypes.func,
  mediaView: PropTypes.bool,
  mediaCancel: PropTypes.func,
  mediaOpen: PropTypes.func
}

export default EditView
