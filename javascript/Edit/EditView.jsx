import React, {useState} from 'react'
import PropTypes from 'prop-types'

import QuizEdit from './Quiz/QuizEdit.jsx'
import QuizView from './Quiz/QuizView.jsx'
import Editor from './DraftEditor'
import ToolbarQ from './Toolbar/QuizToolbar.jsx'

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
  //const [mediaAlign, setMediaAlign] = useState('right')
  const mediaAlign = 'right'

  let imgRender = undefined // Note This does nothing for now, but when we want to add support for images on quizzes this will be here.
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
      />
    )
  }
  if (editView || content.quizContent == null) {
    return (
      <div className="col" style={{marginTop: 12}}>
        <ToolbarQ
          toggleQuizEdit={() => setEditView(!editView)}
          view={editView}
        />
        <span id="space_between_the_toolbar" style={{padding: 1}}></span>
        <QuizEdit
          quizContent={content.quizContent}
          saveQuizContent={saveQuizContent}
          toggle={() => setEditView(false)}
          load={load}
        />
      </div>
    )
  }
  return (
    <div className="col" style={{paddingTop: 12}}>
      <div style={{minWidth: 700}}>
        <ToolbarQ
          toggleQuizEdit={() => setEditView(!editView)}
          view={editView}
        />
        <span id="space_between_the_toolbar" style={{padding: 1}}></span>
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
            {mediaAlign === 'left' ? imgRender : undefined}
            <div className="col">
              <QuizView
                quizContent={content.quizContent}
                toggle={() => setEditView(true)}
              />
            </div>
            {mediaAlign === 'right' ? imgRender : undefined}
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
}

export default EditView
